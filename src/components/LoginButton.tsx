"use client";

import type { MouseEvent } from "react";

export interface ButtonProps {
  toggleLogin: () => void;
}

export function LoginButton({ toggleLogin }: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    toggleLogin();
  }

  return (
    <a
      href="#summarist-login"
      onClick={handleClick}
      className="inline-flex min-h-12 w-full max-w-[18.75rem] items-center justify-center rounded-sm bg-green-400 px-6 text-black transition-colors duration-300 hover:bg-green-600"
    >
      Login
    </a>
  );
}
