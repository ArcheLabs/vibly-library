import { apiFetch } from "./client.js";
import type { Project } from "./types.js";

export async function getProjects(params: { q?: string; limit?: number; offset?: number } = {}): Promise<Project[]> {
  return apiFetch<Project[]>("/api/public/projects", params as Record<string, string | number | boolean | undefined>);
}
