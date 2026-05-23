import { apiFetch } from "./client.js";
import type { Artifact, ArtifactListParams, PaginatedArtifacts } from "./types.js";

export async function getArtifacts(params: ArtifactListParams = {}): Promise<PaginatedArtifacts> {
  return apiFetch<PaginatedArtifacts>("/api/public/artifacts", params as Record<string, string | number | boolean | undefined>);
}

export async function getArtifact(slug: string): Promise<Artifact> {
  const data = await apiFetch<{ artifact: Artifact }>(`/api/public/artifacts/${encodeURIComponent(slug)}`);
  return data.artifact;
}

export async function getPopularArtifacts(params: { limit?: number; locale?: string } = {}): Promise<Artifact[]> {
  const data = await apiFetch<{ items: Artifact[] }>("/api/public/artifacts/popular", params as Record<string, string | number | boolean | undefined>);
  return data.items;
}
