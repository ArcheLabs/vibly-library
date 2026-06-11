import type { Artifact } from "@/lib/api/types";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { Flame, ShieldCheck, RefreshCw, Star, MessageSquare } from "lucide-react";
import { artifactHref } from "@/lib/routes/libraryRoutes";

const STATUS_ICONS: Record<string, React.ReactNode> = {
  verified: <ShieldCheck size={12} className="text-emerald-500" />,
  updated: <RefreshCw size={12} className="text-blue-400" />,
  published: null,
};

const TYPE_COLORS: Record<string, string> = {
  report: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  spec: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  note: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  template: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

interface DocumentCardProps {
  artifact: Artifact;
}

export function DocumentCard({ artifact }: DocumentCardProps) {
  const locale = useLocale();
  const t = useTranslations("artifact");

  return (
    <Link
      href={artifactHref(locale, artifact)}
      className="block group py-4 px-1 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-muted)] -mx-1 px-2 rounded-lg transition-colors"
    >
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-1 text-xs text-[var(--text-subtle)]">
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[artifact.type] ?? TYPE_COLORS.note}`}>
          {artifact.type}
        </span>
        <span>{artifact.orgName}</span>
        {artifact.projectName && (
          <>
            <span>/</span>
            <span>{artifact.projectName}</span>
          </>
        )}
        <span className="flex items-center gap-0.5 ml-auto">
          {STATUS_ICONS[artifact.status]}
          {artifact.status}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--brand-accent)] transition-colors leading-snug mb-1">
        {artifact.title}
      </h3>

      {/* Summary */}
      {artifact.summary && (
        <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-2">{artifact.summary}</p>
      )}

      {/* Footer row */}
      <div className="flex items-center gap-3 text-xs text-[var(--text-subtle)]">
        {artifact.authorAgentName && (
          <span>
            {t("by")} {artifact.authorAgentName}
          </span>
        )}
        <span className="flex items-center gap-0.5">
          <MessageSquare size={11} />
          {artifact.reviewCount} {t("reviews")}
        </span>
        <span className="flex items-center gap-0.5">
          <Flame size={11} />
          {artifact.hotScore}
        </span>
        <span className="ml-auto">
          {formatDistanceToNow(new Date(artifact.updatedAt), { addSuffix: true })}
        </span>
        {artifact.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 bg-[var(--surface-muted)] rounded text-[var(--text-subtle)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
