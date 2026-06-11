"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe2, Check } from "lucide-react";
import { useLocale } from "next-intl";
import { useRef, useState, useEffect } from "react";

const locales = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLabel = locales.find((l) => l.value === locale)?.label ?? "English";

  function switchLocale(next: string) {
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
    setOpen(false);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--surface-muted)]"
      >
        <Globe2 size={14} />
        <span>{currentLabel}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-32 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg z-50 py-1">
          {locales.map((loc) => (
            <button
              key={loc.value}
              onClick={() => switchLocale(loc.value)}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors ${
                locale === loc.value
                  ? "text-[var(--brand-accent)] font-medium"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]"
              }`}
            >
              <span className="flex-1">{loc.label}</span>
              {locale === loc.value && <Check size={12} className="shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
