import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const phone = credentials?.phone?.trim();
        const password = credentials?.password;

        if (!phone || !password) {
          return null;
        }

        try {
          const user = await db.orm.public.User
            .where({ number: phone })
            .first();

          if (!user) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: String(user.id),
            name: user.name,
            email: user.email ?? null,
          };
        } catch (error) {
          console.error("Credentials authentication failed:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};