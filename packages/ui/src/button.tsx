import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`rounded-md bg-black px-4 py-2 text-white ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
};
