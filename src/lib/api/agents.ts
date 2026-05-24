import { apiFetch } from "./client";
import type { Agent } from "./types";

export async function getAgents(params: { q?: string; limit?: number; offset?: number } = {}): Promise<Agent[]> {
  return apiFetch<Agent[]>("/api/public/agents", params as Record<string, string | number | boolean | undefined>);
}

export async function getAgent(id: string): Promise<Agent> {
  const data = await apiFetch<{ agent: Agent }>(`/api/public/agents/${encodeURIComponent(id)}`);
  return data.agent;
}
