"use client";

import Link from "next/link";
import Image from "next/image";
import type { MouseEvent } from "react";
import logo from "/public/assets/pricing-top.png";

type NavbarProps = {
  onLogin: () => void;
};

const linkClass = "inline-flex min-h-11 items-center p-0 text-gray-800 leading-6";

export default function Navbar({ onLogin }: NavbarProps) {
  function handleLoginClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onLogin();
  }

  return (
    <header className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
      <Image src={logo} alt="Summarist logo" className="mt-2 h-auto w-36 shrink-0 sm:w-44 lg:w-50" priority />
      <nav className="ml-auto mt-2 flex items-center gap-3 sm:gap-5 lg:gap-6" aria-label="Main navigation">
        {/* A real anchor keeps opening the modal even if client hydration fails. */}
        <Link href="#summarist-login" onClick={handleLoginClick} className={linkClass}>
          Login
        </Link>
        <Link href="#" className={`${linkClass} hidden cursor-not-allowed text-gray-500 sm:inline-flex`}>About</Link>
        <Link href="#" className={`${linkClass} hidden cursor-not-allowed text-gray-500 sm:inline-flex`}>Contact</Link>
        <Link href="#" className={`${linkClass} hidden cursor-not-allowed text-gray-500 sm:inline-flex`}>Help</Link>
      </nav>
    </header>
  );
}
