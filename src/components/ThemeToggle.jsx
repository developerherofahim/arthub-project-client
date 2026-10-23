"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { mounted, isDark, toggleTheme } = useTheme();
  const label = mounted
    ? isDark
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Loading theme preference";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!mounted}
      aria-label={label}
      aria-pressed={mounted && isDark}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-art-border bg-art-white text-art-secondary transition-colors hover:border-art-primary/60 hover:text-art-primary ${className}`}
    >
      {mounted && isDark ? (
        <Sun size={16} className="text-amber-400" />
      ) : (
        <Moon size={16} />
      )}
    </button>
  );
}
