"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Building2, FolderKanban, Bot } from "lucide-react";
import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentFilters } from "@/components/documents/DocumentFilters";
import { PopularDocuments } from "@/components/documents/PopularDocuments";
import { getArtifacts, getPopularArtifacts } from "@/lib/api/artifacts";
import type { Artifact, ArtifactListParams } from "@/lib/api/types";

export function HomeClient({ popular }: { popular: Artifact[] }) {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const fetchId = useRef(0);

  // Build params from URL
  const params: ArtifactListParams = {
    q: searchParams.get("q") ?? undefined,
    sort: (searchParams.get("sort") as ArtifactListParams["sort"]) ?? "comprehensive",
    type: (searchParams.get("type") as ArtifactListParams["type"]) ?? undefined,
    status: (searchParams.get("status") as ArtifactListParams["status"]) ?? undefined,
    locale,
    limit: 20,
  };

  useEffect(() => {
    const id = ++fetchId.current;
    setLoading(true);
    getArtifacts(params).then((result) => {
      if (fetchId.current !== id) return;
      setArtifacts(result.items);
      setTotal(result.total);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const updateParams = useCallback(
    (updates: Partial<ArtifactListParams>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v == null || v === "") next.delete(k);
        else next.set(k, String(v));
      }
      startTransition(() => router.push(`?${next.toString()}`));
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left: document list */}
      <section className="flex-1 min-w-0">
        {/* Search */}
        <div className="relative mb-2">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={params.q ?? ""}
            onChange={(e) => updateParams({ q: e.target.value || undefined })}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
          />
        </div>

        <DocumentFilters params={params} onChange={updateParams} />

        <p className="text-xs text-[var(--text-subtle)] mb-3">
          {total} {t("results")}
        </p>

        <DocumentList artifacts={artifacts} loading={loading} />
      </section>

      {/* Right: sidebar */}
      <aside className="lg:w-72 shrink-0 space-y-4">
        <PopularDocuments artifacts={popular} />

        {/* Explore */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="font-semibold text-sm text-[var(--text)] mb-3">{t("explore")}</h2>
          <div className="space-y-1">
            <Link
              href={`/${locale}/orgs`}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--brand-accent)] transition-colors py-1"
            >
              <Building2 size={14} /> {t("browseOrgs")}
            </Link>
            <Link
              href={`/${locale}/projects`}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--brand-accent)] transition-colors py-1"
            >
              <FolderKanban size={14} /> {t("browseProjects")}
            </Link>
            <Link
              href={`/${locale}/agents`}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--brand-accent)] transition-colors py-1"
            >
              <Bot size={14} /> {t("browseAgents")}
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
