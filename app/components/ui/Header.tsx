"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoClose, IoMenu } from "react-icons/io5";
import Logo from "../images/gamepad.svg";
import ThemeToggle from "./ThemeToggle";

const navigationItems = [
  { href: "/", label: "Головна" },
  { href: "/reviews", label: "Ігрові рецензії" },
  { href: "/collections", label: "Добірки" },
  { href: "/backlog", label: "Беклог" },
];

function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    firstMobileLinkRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  function isActive(href: string) {
    return href === "/" ? pathname === href : pathname.startsWith(href);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 border-b font-sans transition-[top,left,right,height,background-color,border-color,border-radius] duration-500 ease-in-out lg:h-20 ${
        isScrolled
          ? "border-zinc-800/25 bg-background/90 backdrop-blur-md dark:border-zinc-400/25 lg:left-6 lg:right-6 lg:top-4 lg:rounded-3xl lg:border"
          : "border-zinc-800/25 bg-background dark:border-zinc-400/25"
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-[96rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          aria-label="Game Vault — головна"
          className="flex min-w-0 shrink-0 items-center gap-2 text-main transition-colors hover:text-accent"
        >
          <Logo aria-hidden="true" className="h-9 w-9 shrink-0 text-accent" />
          <span className="hidden truncate font-pixel text-[0.7rem] uppercase leading-relaxed sm:block xl:text-xs">
            Game Vault
          </span>
        </Link>

        <nav
          aria-label="Головна навігація"
          className="hidden items-center gap-5 lg:flex xl:gap-8"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`whitespace-nowrap text-lg font-bold transition-colors duration-300 xl:text-xl ${
                isActive(item.href)
                  ? "text-accent"
                  : "text-main hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={isMenuOpen ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-main transition hover:bg-bg-alt/50 hover:text-accent lg:hidden"
          >
            {isMenuOpen ? (
              <IoClose aria-hidden="true" size={25} />
            ) : (
              <IoMenu aria-hidden="true" size={25} />
            )}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Мобільна навігація"
        aria-hidden={!isMenuOpen}
        className={`absolute left-0 right-0 top-full border-b border-zinc-800/25 bg-background/95 px-4 py-3 shadow-xl backdrop-blur-md transition duration-200 dark:border-zinc-400/25 lg:hidden ${
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="mx-auto grid max-w-[96rem] gap-1">
          {navigationItems.map((item, index) => (
            <Link
              ref={index === 0 ? firstMobileLinkRef : undefined}
              key={item.href}
              href={item.href}
              tabIndex={isMenuOpen ? 0 : -1}
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
              className={`flex min-h-12 items-center rounded-xl px-4 py-3 text-lg font-bold transition-colors ${
                isActive(item.href)
                  ? "bg-bg-alt/50 text-accent"
                  : "text-main hover:bg-bg-alt/50 hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;
