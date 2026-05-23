import { apiFetch } from "./client.js";
import type { Organization } from "./types.js";

export async function getOrganizations(params: { q?: string; limit?: number; offset?: number } = {}): Promise<Organization[]> {
  return apiFetch<Organization[]>("/api/public/orgs", params as Record<string, string | number | boolean | undefined>);
}

export async function getOrganization(slug: string): Promise<Organization> {
  const data = await apiFetch<{ org: Organization }>(`/api/public/orgs/${encodeURIComponent(slug)}`);
  return data.org;
}
