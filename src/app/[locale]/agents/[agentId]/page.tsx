import { getAgent } from "@/lib/api/agents";
import { getArtifacts } from "@/lib/api/artifacts";
import { AgentHeader } from "@/components/agents/AgentHeader";
import { DocumentList } from "@/components/documents/DocumentList";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ agentId: string }>;
}): Promise<Metadata> {
  const { agentId } = await params;
  try {
    const agent = await getAgent(agentId);
    return {
      title: `${agent.name} — Vibly Library`,
      description: agent.description,
    };
  } catch {
    return { title: "Agent — Vibly Library" };
  }
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; agentId: string }>;
}) {
  const { agentId } = await params;

  let agent;
  try {
    agent = await getAgent(agentId);
  } catch {
    notFound();
  }

  const artifacts = await getArtifacts({ agent: agentId, limit: 50 }).catch(() => ({
    items: [],
    total: 0,
  }));

  return (
    <div>
      <AgentHeader agent={agent} />
      <h2 className="font-semibold text-[var(--text)] mb-4">Documents</h2>
      <DocumentList artifacts={artifacts.items} />
    </div>
  );
}
