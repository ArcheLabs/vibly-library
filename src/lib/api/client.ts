/**
 * Library API base client.
 *
 * - Server components: calls coordinator directly (COORDINATOR_URL / NEXT_PUBLIC_COORDINATOR_URL)
 *   with Next.js `revalidate` cache hint.
 * - Client components: calls the local Next.js proxy at /api/public/* (same-origin,
 *   no CORS issues). The proxy in turn forwards to the coordinator server-side.
 */

const LOCAL_COORDINATOR_URL = "http://localhost:3001";
const PRODUCTION_COORDINATOR_URL = "https://vibly-coordinator-910361199868.asia-east1.run.app";
const DEFAULT_COORDINATOR_URL = process.env.NODE_ENV === "production" ? PRODUCTION_COORDINATOR_URL : LOCAL_COORDINATOR_URL;

/** True when running in a browser (client component / useEffect). */

export class LibraryApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    public readonly upstreamPath?: string,
    public readonly upstreamUrl?: string,
  ) {
    super(message);
    this.name = "LibraryApiError";
  }
}

export function coordinatorOrigin(): string {
  return new URL(coordinatorBaseUrl()).origin;
}

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const isServer = typeof window === "undefined";
  const fullUrl = isServer
    ? buildCoordinatorUrl(path, params)
    : buildLocalApiUrl(path, params);
  const headers = versionHeaders();
  const res = await fetch(
    fullUrl.toString(),
    isServer ? { cache: "no-store", headers } : { headers },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as Record<string, unknown>;
    const errBody = body.error as Record<string, unknown> | undefined;
    throw new LibraryApiError(
      res.status,
      typeof errBody?.message === "string" ? errBody.message : `HTTP ${res.status}`,
      typeof errBody?.code === "string" ? errBody.code : undefined,
      `${fullUrl.pathname}${fullUrl.search}`,
      fullUrl.toString(),
    );
  }

  const envelope = await res.json() as { ok: boolean; data: T; page?: unknown };
  return envelope.data;
}

export function coordinatorBaseUrl(): string {
  return firstNonEmpty(
    process.env.COORDINATOR_URL,
    process.env.LUMEN_COORDINATOR_URL,
    process.env.NEXT_PUBLIC_COORDINATOR_URL,
  ) ?? DEFAULT_COORDINATOR_URL;
}

export function buildCoordinatorUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): URL {
  const fullUrl = new URL(path, coordinatorBaseUrl());
  appendParams(fullUrl, params);
  return fullUrl;
}

export function versionHeaders(): Record<string, string> {
  return {
    "x-vibly-client-version": firstNonEmpty(process.env.VIBLY_LIBRARY_CLIENT_VERSION, process.env.NEXT_PUBLIC_VIBLY_CLIENT_VERSION) ?? "0.1.1",
    "x-vibly-contract-version": firstNonEmpty(process.env.VIBLY_LIBRARY_CONTRACT_VERSION, process.env.NEXT_PUBLIC_VIBLY_CONTRACT_VERSION) ?? "0.1.1",
    "x-vibly-protocol-version": firstNonEmpty(process.env.VIBLY_LIBRARY_PROTOCOL_VERSION, process.env.NEXT_PUBLIC_VIBLY_PROTOCOL_VERSION) ?? "0.2",
    "x-vibly-client-package": "vibly-library",
  };
}

function buildLocalApiUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): URL {
  const fullUrl = new URL(path, window.location.origin);
  appendParams(fullUrl, params);
  return fullUrl;
}

function appendParams(url: URL, params?: Record<string, string | number | boolean | undefined>): void {
  if (!params) return;
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
}

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  return values.find((value) => value !== undefined && value.trim() !== "");
}
