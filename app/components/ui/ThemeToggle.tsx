"use client";

import { useEffect, useSyncExternalStore } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

type Theme = "light" | "dark";

const THEME_EVENT = "theme-change";

function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function toggleTheme() {
    const newTheme: Theme = theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Увімкнути світлу тему" : "Увімкнути темну тему"
      }
      title={theme === "dark" ? "Світла тема" : "Темна тема"}
      className="
        flex h-11 w-11 items-center justify-center rounded-full
        text-main
        transition hover:bg-bg-alt/50 hover:text-accent active:scale-95
      "
    >
      {theme === "dark" ? (
        <FaSun aria-hidden="true" size={18} />
      ) : (
        <FaMoon aria-hidden="true" size={18} />
      )}
    </button>
  );
}

export default ThemeToggle;
