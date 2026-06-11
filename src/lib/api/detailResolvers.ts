import { LibraryApiError, coordinatorOrigin } from "./client";
import { getArtifact, getArtifacts } from "./artifacts";
import type { Artifact } from "./types";
import { artifactLookupCandidates, extractShortArtifactId, shortPublicId } from "@/lib/routes/libraryRoutes";

export interface DetailLookupAttempt {
  upstreamPath: string;
  upstreamStatus?: number;
  reason: string;
}

export class DetailNotFoundError extends Error {
  constructor(
    public readonly route: string,
    public readonly paramName: string,
    public readonly paramValue: string,
    public readonly attempts: DetailLookupAttempt[],
  ) {
    super(`Detail not found for ${route} ${paramName}=${paramValue}`);
    this.name = "DetailNotFoundError";
  }
}

export async function resolveArtifactDetail(routeParam: string): Promise<Artifact> {
  const attempts: DetailLookupAttempt[] = [];

  for (const candidate of artifactLookupCandidates(routeParam)) {
    try {
      return await getArtifact(candidate);
    } catch (err) {
      attempts.push(attemptFromError(err, `/api/public/artifacts/${encodeURIComponent(candidate)}`));
    }
  }

  const shortId = extractShortArtifactId(routeParam);
  if (shortId) {
    try {
      const artifacts = await getArtifacts({ limit: 100 });
      const artifact = artifacts.items.find((item) => shortPublicId(item.id) === shortId);
      if (artifact) return artifact;
      attempts.push({ upstreamPath: "/api/public/artifacts?limit=100", reason: `short id ${shortId} not found in runtime artifact list` });
    } catch (err) {
      attempts.push(attemptFromError(err, "/api/public/artifacts?limit=100"));
    }
  }

  throw new DetailNotFoundError("/[locale]/artifacts/[artifactSlug]", "artifactSlug", routeParam, attempts);
}

export function logDetailNotFound(error: unknown, fallback: {
  route: string;
  paramName: string;
  paramValue: string;
  reason: string;
}): void {
  if (error instanceof DetailNotFoundError) {
    console.warn("[vibly-library] detail not found", {
      route: error.route,
      paramName: error.paramName,
      paramValue: error.paramValue,
      coordinatorOrigin: coordinatorOrigin(),
      attempts: error.attempts,
      reason: "resolver exhausted all lookup candidates",
    });
    return;
  }

  if (error instanceof LibraryApiError) {
    console.warn("[vibly-library] detail not found", {
      route: fallback.route,
      paramName: fallback.paramName,
      paramValue: fallback.paramValue,
      coordinatorOrigin: coordinatorOrigin(),
      upstreamPath: error.upstreamPath,
      upstreamStatus: error.status,
      reason: fallback.reason,
    });
    return;
  }

  console.warn("[vibly-library] detail not found", {
    route: fallback.route,
    paramName: fallback.paramName,
    paramValue: fallback.paramValue,
    coordinatorOrigin: coordinatorOrigin(),
    reason: fallback.reason,
  });
}

function attemptFromError(error: unknown, fallbackPath: string): DetailLookupAttempt {
  if (error instanceof LibraryApiError) {
    return {
      upstreamPath: error.upstreamPath ?? fallbackPath,
      upstreamStatus: error.status,
      reason: error.code ?? error.message,
    };
  }
  return { upstreamPath: fallbackPath, reason: String(error) };
}
