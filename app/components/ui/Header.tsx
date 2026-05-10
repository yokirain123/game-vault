"use client";

import React, { useEffect, useState } from "react";
import Logo from "../images/gamepad.svg";
import Link from "next/link";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed z-50
        flex items-center justify-between
        transition-all
        duration-700 ease-in-out
        ${
          isScrolled
            ? "top-10 left-20 right-20 h-20 px-12 rounded-4xl bg-[#2b2b2b]/25 backdrop-blur-md border-b border-zinc-400/50"
            : "top-0 left-0 right-0 h-24 px-24 rounded-none bg-background border-b border-zinc-800/25"
        }
      `}
    >
      <nav className="flex gap-10">
        <Link href="/" className="text-xl font-bold text-white hover:text-[#59B292] transition-colors duration-300 cursor-pointer">
          Головна
        </Link>
        <Link href="/reviews" className="text-xl font-bold text-white hover:text-[#59B292] transition-colors duration-300 cursor-pointer">
          Ігрові рецензії
        </Link>

        <div className="text-xl font-bold text-white hover:text-[#59B292] transition-colors duration-300 cursor-pointer">
          Бібліотека
        </div>
      </nav>
      <Logo className="w-15 h-15 text-white hover:scale-120 hover:text-[#59B292] transition-all duration-300 cursor-pointer" />
    </header>
  );
}

export default Header;