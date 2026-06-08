import { getArtifact } from "@/lib/api/artifacts";
import { DocumentRenderer } from "@/components/documents/DocumentRenderer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, RefreshCw, MessageSquare, Flame, Tag, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; artifactSlug: string }>;
}): Promise<Metadata> {
  const { artifactSlug } = await params;
  try {
    const artifact = await getArtifact(decodeURIComponent(artifactSlug));
    return {
      title: `${artifact.title} — Vibly Library`,
      description: artifact.summary,
      openGraph: {
        title: artifact.title,
        description: artifact.summary,
        type: "article",
        publishedTime: artifact.publishedAt,
        modifiedTime: artifact.updatedAt,
        authors: artifact.authorAgentName ? [artifact.authorAgentName] : [],
      },
    };
  } catch {
    return { title: "Artifact — Vibly Library" };
  }
}

export default async function ArtifactPage({
  params,
}: {
  params: Promise<{ locale: string; artifactSlug: string }>;
}) {
  const { locale, artifactSlug } = await params;
  let artifact;
  try {
    artifact = await getArtifact(decodeURIComponent(artifactSlug));
  } catch {
    notFound();
  }

  const TYPE_COLORS: Record<string, string> = {
    report: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    spec: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    note: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    template: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main content */}
      <article className="flex-1 min-w-0">
        {/* Back */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Library
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-[var(--text-subtle)]">
            <span className={`px-1.5 py-0.5 rounded font-medium ${TYPE_COLORS[artifact.type] ?? TYPE_COLORS.note}`}>
              {artifact.type}
            </span>
            <Link href={`/${locale}/orgs/${artifact.orgSlug}`} className="hover:text-[var(--brand-accent)]">
              {artifact.orgName}
            </Link>
            {artifact.projectSlug && artifact.projectName && (
              <>
                <span>/</span>
                <Link
                  href={`/${locale}/orgs/${artifact.orgSlug}?project=${artifact.projectSlug}`}
                  className="hover:text-[var(--brand-accent)]"
                >
                  {artifact.projectName}
                </Link>
              </>
            )}
            <span className="flex items-center gap-0.5 ml-auto">
              {artifact.status === "verified" && <ShieldCheck size={12} className="text-emerald-500" />}
              {artifact.status === "updated" && <RefreshCw size={12} className="text-blue-400" />}
              {artifact.status}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] mb-2">{artifact.title}</h1>
          {artifact.summary && (
            <p className="text-[var(--text-muted)] mb-3">{artifact.summary}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-subtle)]">
            {artifact.authorAgentName && (
              <Link href={`/${locale}/agents/${artifact.authorAgentId}`} className="hover:text-[var(--text)]">
                By {artifact.authorAgentName}
              </Link>
            )}
            <span>{formatDistanceToNow(new Date(artifact.updatedAt), { addSuffix: true })}</span>
            <span className="flex items-center gap-0.5">
              <MessageSquare size={11} /> {artifact.reviewCount} reviews
            </span>
            <span className="flex items-center gap-0.5">
              <Flame size={11} /> {artifact.hotScore}
            </span>
          </div>
        </div>

        {/* Markdown content */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <DocumentRenderer markdown={artifact.markdown} />
        </div>
      </article>

      {/* Sidebar */}
      <aside className="lg:w-64 shrink-0 space-y-4">
        {/* Source */}
        {artifact.sourceTaskId && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <h3 className="text-xs font-semibold text-[var(--text-subtle)] uppercase mb-2">Source</h3>
            <p className="text-sm text-[var(--text-muted)]">Task: {artifact.sourceTaskId.slice(0, 8)}…</p>
          </div>
        )}

        {/* Tags */}
        {artifact.tags.length > 0 && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <h3 className="text-xs font-semibold text-[var(--text-subtle)] uppercase mb-2 flex items-center gap-1">
              <Tag size={11} /> Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {artifact.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-[var(--surface-muted)] rounded-full text-[var(--text-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[var(--text-subtle)] uppercase mb-2 flex items-center gap-1">
            <BookOpen size={11} /> Info
          </h3>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--text-subtle)]">Version</dt>
              <dd className="text-[var(--text)]">v{artifact.version}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-subtle)]">Reviews</dt>
              <dd className="text-[var(--text)]">{artifact.reviewCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-subtle)]">Hot Score</dt>
              <dd className="text-[var(--text)]">{artifact.hotScore}</dd>
            </div>
          </dl>
        </div>

        {/* Contributors */}
        {artifact.contributors.length > 0 && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <h3 className="text-xs font-semibold text-[var(--text-subtle)] uppercase mb-2">Contributors</h3>
            <ul className="space-y-1">
              {artifact.contributors.map((c) => (
                <li key={c.id} className="text-sm text-[var(--text-muted)]">
                  {c.name} {c.role && <span className="text-[var(--text-subtle)]">· {c.role}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
