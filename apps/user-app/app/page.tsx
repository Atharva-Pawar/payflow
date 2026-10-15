"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";

export default function Page() {
  const { data: session, status } = useSession();

  return (
    <div>
      <Appbar
        onSignin={() => void signIn()}
        onSignout={() => void signOut()}
        user={session?.user}
      />
    </div>
  );
}