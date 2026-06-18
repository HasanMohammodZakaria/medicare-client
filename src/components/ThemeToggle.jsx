"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "@gravity-ui/icons";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        border
        border-base
        bg-card
        transition-all
        hover:bg-card-hover
      "
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-500" />
      )}
    </button>
  );
}
