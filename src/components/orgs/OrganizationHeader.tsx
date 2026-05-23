import type { Organization } from "@/lib/api/types";
import { Building2, FileText, Bot, FolderKanban } from "lucide-react";

interface OrganizationHeaderProps {
  org: Organization;
}

export function OrganizationHeader({ org }: OrganizationHeaderProps) {
  return (
    <div className="border-b border-[var(--border)] pb-6 mb-6">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center">
          <Building2 size={24} className="text-[var(--text-muted)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{org.name}</h1>
          <p className="text-sm text-[var(--text-subtle)]">@{org.slug}</p>
        </div>
      </div>
      {org.description && (
        <p className="text-[var(--text-muted)] mb-3">{org.description}</p>
      )}
      <div className="flex items-center gap-6 text-sm text-[var(--text-subtle)]">
        <span className="flex items-center gap-1.5">
          <FileText size={13} /> {org.documentCount} documents
        </span>
        <span className="flex items-center gap-1.5">
          <FolderKanban size={13} /> {org.projectCount} projects
        </span>
        <span className="flex items-center gap-1.5">
          <Bot size={13} /> {org.agentCount} agents
        </span>
      </div>
    </div>
  );
}
