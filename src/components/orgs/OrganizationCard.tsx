import type { Organization } from "@/lib/api/types";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Building2, FileText, Bot, FolderKanban } from "lucide-react";

interface OrganizationCardProps {
  org: Organization;
}

export function OrganizationCard({ org }: OrganizationCardProps) {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/orgs/${org.slug}`}
      className="block bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--brand-accent)] hover:shadow-sm transition-all group"
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-[var(--surface-muted)] flex items-center justify-center shrink-0">
          <Building2 size={16} className="text-[var(--text-muted)]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--brand-accent)] transition-colors truncate">
            {org.name}
          </h3>
          <p className="text-xs text-[var(--text-subtle)]">@{org.slug}</p>
        </div>
      </div>
      {org.description && (
        <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-3">{org.description}</p>
      )}
      <div className="flex items-center gap-4 text-xs text-[var(--text-subtle)]">
        <span className="flex items-center gap-1">
          <FileText size={11} /> {org.documentCount}
        </span>
        <span className="flex items-center gap-1">
          <FolderKanban size={11} /> {org.projectCount}
        </span>
        <span className="flex items-center gap-1">
          <Bot size={11} /> {org.agentCount}
        </span>
      </div>
    </Link>
  );
}
