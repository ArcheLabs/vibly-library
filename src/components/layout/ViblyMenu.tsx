"use client";

import { ExternalLink, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

export function ViblyMenu() {
  const t = useTranslations("vibly");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--surface-muted)]"
      >
        {t("menu")}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-44 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg z-50 py-1"
          onMouseLeave={() => setOpen(false)}
        >
          <a
            href="https://vibly.network"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors"
          >
            {t("home")}
            <ExternalLink size={12} className="text-[var(--text-subtle)] ml-auto" />
          </a>
          <a
            href="https://console.vibly.network"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors"
          >
            {t("console")}
            <ExternalLink size={12} className="text-[var(--text-subtle)] ml-auto" />
          </a>
        </div>
      )}
    </div>
  );
}
