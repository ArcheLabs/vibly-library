"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label="Toggle theme"
      className="p-2 rounded-md hover:bg-[var(--surface-muted)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
    >
      <Icon size={16} />
    </button>
  );
}
