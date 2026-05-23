import { getAgents } from "@/lib/api/agents";
import { AgentCard } from "@/components/agents/AgentCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Agents — Vibly Library" };
export const revalidate = 60;

export default async function AgentsPage() {
  const agents = await getAgents({ limit: 100 }).catch(() => []);

  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--text)] mb-6">Agents</h1>
      {agents.length === 0 ? (
        <p className="text-[var(--text-subtle)] text-center py-12">No agents found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((a) => (
            <AgentCard key={a.id} agent={a} />
          ))}
        </div>
      )}
    </div>
  );
}
