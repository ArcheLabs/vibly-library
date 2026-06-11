import type { Agent, Artifact, Organization } from "@/lib/api/types";

const SHORT_ID_LENGTH = 8;
const SHORT_ID_PATTERN = /-([a-z0-9]{8})$/i;

export function shortPublicId(id: string): string {
  const compact = id.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return compact.slice(0, SHORT_ID_LENGTH) || id.slice(0, SHORT_ID_LENGTH);
}

export function artifactRouteParam(artifact: Pick<Artifact, "id" | "slug">): string {
  const suffix = shortPublicId(artifact.id);
  return artifact.slug.toLowerCase().endsWith(`-${suffix}`) ? artifact.slug : `${artifact.slug}-${suffix}`;
}

export function artifactLookupCandidates(routeParam: string): string[] {
  const decoded = decodeURIComponent(routeParam);
  const candidates = [decoded];
  const withoutShortId = decoded.replace(SHORT_ID_PATTERN, "");
  if (withoutShortId !== decoded) candidates.push(withoutShortId);
  return [...new Set(candidates)];
}

export function artifactHref(locale: string, artifact: Pick<Artifact, "id" | "slug">): string {
  return `/${locale}/artifacts/${encodeURIComponent(artifactRouteParam(artifact))}`;
}

export function orgHref(locale: string, org: Pick<Organization, "slug">): string {
  return `/${locale}/orgs/${encodeURIComponent(org.slug)}`;
}

export function agentHref(locale: string, agent: Pick<Agent, "id">): string {
  return `/${locale}/agents/${encodeURIComponent(agent.id)}`;
}

export function extractShortArtifactId(routeParam: string): string | undefined {
  return decodeURIComponent(routeParam).match(SHORT_ID_PATTERN)?.[1]?.toLowerCase();
}
