"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe2 } from "lucide-react";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(next: string) {
    // Replace the current locale prefix in the path
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex items-center gap-1">
      <Globe2 size={14} className="text-[var(--text-muted)]" />
      {(["en", "zh"] as const).map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`text-xs px-1 py-0.5 rounded transition-colors ${
            locale === loc
              ? "text-[var(--brand-accent)] font-medium"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          {loc === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}
