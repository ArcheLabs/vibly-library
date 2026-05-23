import type { Artifact } from "@/lib/api/types";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PopularDocumentsProps {
  artifacts: Artifact[];
}

export function PopularDocuments({ artifacts }: PopularDocumentsProps) {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <aside className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
      <h2 className="flex items-center gap-1.5 font-semibold text-sm text-[var(--text)] mb-3">
        <Flame size={14} className="text-orange-500" />
        {t("popular")}
      </h2>
      {artifacts.length === 0 ? (
        <p className="text-sm text-[var(--text-subtle)]">{t("noPopular")}</p>
      ) : (
        <ol className="space-y-2">
          {artifacts.map((a, i) => (
            <li key={a.id}>
              <Link
                href={`/${locale}/artifacts/${a.slug}`}
                className="flex gap-2 group"
              >
                <span className="text-xs text-[var(--text-subtle)] w-4 shrink-0 mt-0.5">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-sm text-[var(--text)] group-hover:text-[var(--brand-accent)] transition-colors line-clamp-2 leading-snug">
                    {a.title}
                  </p>
                  <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                    {formatDistanceToNow(new Date(a.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
