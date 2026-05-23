/**
 * Library API base client.
 *
 * Uses a lightweight typed fetch wrapper until the public library routes
 * are regenerated into @vibly/coordinator-http-contract.
 */

const COORDINATOR_URL =
  process.env.NEXT_PUBLIC_COORDINATOR_URL ?? "http://localhost:3001";

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
  const url = new URL(`${COORDINATOR_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
  });

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
