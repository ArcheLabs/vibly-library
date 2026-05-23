"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import type { Artifact, Project } from "@/lib/api/types";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useTransition } from "react";

interface OrganizationTabsProps {
  orgSlug: string;
  artifacts: Artifact[];
  projects: Project[];
  activeProject?: string;
}

export function OrganizationTabs({
  orgSlug,
  artifacts,
  projects,
  activeProject,
}: OrganizationTabsProps) {
  const t = useTranslations("org");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "documents";
  const [, startTransition] = useTransition();

  function setTab(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    if (value === "documents") params.delete("project");
    startTransition(() => router.push(`/${locale}/orgs/${orgSlug}?${params.toString()}`));
  }

  function setProject(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("project", slug);
    else params.delete("project");
    startTransition(() => router.push(`/${locale}/orgs/${orgSlug}?${params.toString()}`));
  }

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-0.5 border-b border-[var(--border)] mb-4">
        {["documents", "projects"].map((t_) => (
          <button
            key={t_}
            onClick={() => setTab(t_)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t_
                ? "border-[var(--brand-accent)] text-[var(--brand-accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {t_ === "documents" ? t("documents") : t("projects")}
          </button>
        ))}
      </div>

      {tab === "documents" && (
        <div>
          {/* Project filter chips */}
          {projects.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setProject(null)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  !activeProject
                    ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-white"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
                }`}
              >
                All
              </button>
              {projects.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setProject(p.slug)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    activeProject === p.slug
                      ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-white"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
          {artifacts.length === 0 ? (
            <p className="text-sm text-[var(--text-subtle)] py-8 text-center">No documents found.</p>
          ) : (
            artifacts.map((a) => <DocumentCard key={a.id} artifact={a} />)
          )}
        </div>
      )}

      {tab === "projects" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
