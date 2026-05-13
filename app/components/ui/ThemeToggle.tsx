"use client";

import { useEffect, useSyncExternalStore } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

type Theme = "light" | "dark";

const THEME_EVENT = "theme-change";

function getTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return "light";
}

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerSnapshot(): Theme {
  return "light";
}

function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    const newTheme: Theme = theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title="Change theme"
      className="
        flex h-11 w-11 items-center justify-center rounded-full
     text-main
        transition-all duration-300
        hover:scale-110 hover:text-accent
      dark:text-accent 
      "
    >
      {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
    </button>
  );
}

export default ThemeToggle;
