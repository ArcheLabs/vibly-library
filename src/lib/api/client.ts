/**
 * Library API base client.
 *
 * - Server components: calls coordinator directly (COORDINATOR_URL / NEXT_PUBLIC_COORDINATOR_URL)
 *   with Next.js `revalidate` cache hint.
 * - Client components: calls the local Next.js proxy at /api/public/* (same-origin,
 *   no CORS issues). The proxy in turn forwards to the coordinator server-side.
 */

const COORDINATOR_URL =
  process.env.NEXT_PUBLIC_COORDINATOR_URL ?? "http://localhost:3001";

/** True when running in a browser (client component / useEffect). */
const IS_CLIENT = typeof window !== "undefined";

export class LibraryApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "LibraryApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  // Client-side: use relative URL so the request stays same-origin (no CORS).
  // Server-side: call the coordinator directly and enable Next.js ISR caching.
  const fullUrl = IS_CLIENT
    ? new URL(path, window.location.origin)
    : new URL(`${COORDINATOR_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) fullUrl.searchParams.set(key, String(value));
    }
  }

  const fetchOptions: RequestInit = IS_CLIENT
    ? {} // browser fetch — no server-only extensions
    : { next: { revalidate: 60 } } as RequestInit; // server fetch — ISR cache

  const res = await fetch(fullUrl.toString(), fetchOptions);

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as Record<string, unknown>;
    const errBody = body.error as Record<string, unknown> | undefined;
    throw new LibraryApiError(
      res.status,
      typeof errBody?.message === "string" ? errBody.message : `HTTP ${res.status}`,
      typeof errBody?.code === "string" ? errBody.code : undefined,
    );
  }

  const envelope = await res.json() as { ok: boolean; data: T; page?: unknown };
  return envelope.data;
}

