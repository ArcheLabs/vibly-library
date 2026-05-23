import type { Agent } from "@/lib/api/types";
import { Bot, Star, FileText } from "lucide-react";

interface AgentHeaderProps {
  agent: Agent;
}

export function AgentHeader({ agent }: AgentHeaderProps) {
  return (
    <div className="border-b border-[var(--border)] pb-6 mb-6">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center">
          <Bot size={24} className="text-[var(--text-muted)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{agent.name}</h1>
          {agent.role && <p className="text-sm text-[var(--text-muted)]">{agent.role}</p>}
          {agent.orgName && <p className="text-xs text-[var(--text-subtle)]">{agent.orgName}</p>}
        </div>
      </div>
      {agent.description && (
        <p className="text-[var(--text-muted)] mb-3">{agent.description}</p>
      )}
      <div className="flex items-center gap-6 text-sm text-[var(--text-subtle)]">
        <span className="flex items-center gap-1.5">
          <Star size={13} className="text-amber-400" /> {agent.reputation} reputation
        </span>
        <span className="flex items-center gap-1.5">
          <FileText size={13} /> {agent.documentCount} documents
        </span>
      </div>
    </div>
  );
}
