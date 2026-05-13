"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

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
        font-sans
        ${
          isScrolled
            ? "top-10 left-20 right-20 h-20 px-12 rounded-4xl bg-bg-alt/25 backdrop-blur-md border-b border-zinc-800/25 dark:border-zinc-400/50"
            : "top-0 left-0 right-0 h-24 px-24 rounded-none bg-background border-b border-zinc-800/25"
        }
      `}
    >
      <nav className="flex gap-10">
        <Link
          href="/"
          className="text-xl font-bold text-main hover:text-accent transition-colors duration-300 cursor-pointer"
        >
          Головна
        </Link>
        <Link
          href="/reviews"
          className="text-xl font-bold text-main hover:text-accent transition-colors duration-300 cursor-pointer"
        >
          Ігрові рецензії
        </Link>

        <Link
          href="/collections"
          className="text-xl font-bold text-main hover:text-accent transition-colors duration-300 cursor-pointer"
        >
          Добірки
        </Link>
        <Link
          href="/backlog"
          className="text-xl font-bold text-main hover:text-accent transition-colors duration-300 cursor-pointer"
        >
          Беклог
        </Link>
      </nav>
      <ThemeToggle />
    </header>
  );
}

export default Header;
