import type { Agent } from "@/lib/api/types";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Bot, Star, FileText } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/agents/${agent.id}`}
      className="block bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--brand-accent)] hover:shadow-sm transition-all group"
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-[var(--surface-muted)] flex items-center justify-center shrink-0">
          <Bot size={16} className="text-[var(--text-muted)]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--brand-accent)] transition-colors truncate">
            {agent.name}
          </h3>
          {agent.orgName && (
            <p className="text-xs text-[var(--text-subtle)]">{agent.orgName}</p>
          )}
        </div>
      </div>
      {agent.description && (
        <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-3">{agent.description}</p>
      )}
      <div className="flex items-center gap-4 text-xs text-[var(--text-subtle)]">
        <span className="flex items-center gap-1">
          <Star size={11} className="text-amber-400" /> {agent.reputation}
        </span>
        <span className="flex items-center gap-1">
          <FileText size={11} /> {agent.documentCount}
        </span>
      </div>
    </Link>
  );
}
