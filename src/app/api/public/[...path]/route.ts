import { buildCoordinatorUrl, versionHeaders } from "@/lib/api/client";
import type { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  const upstreamPath = `/api/public/${path.map(encodeURIComponent).join("/")}`;
  const upstreamUrl = buildCoordinatorUrl(upstreamPath);

  request.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.append(key, value);
  });

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl.toString(), {
      cache: "no-store",
      headers: {
        ...versionHeaders(),
        accept: request.headers.get("accept") ?? "application/json",
      },
    });
  } catch (error) {
    const cause = error instanceof Error ? error.message : String(error);
    console.warn("[vibly-library] public api proxy fetch failed", {
      upstreamOrigin: upstreamUrl.origin,
      upstreamPath: `${upstreamUrl.pathname}${upstreamUrl.search}`,
      reason: cause,
    });

    return Response.json(
      {
        ok: false,
        error: {
          code: "UPSTREAM_FETCH_FAILED",
          message: "Failed to fetch Coordinator public API.",
          details: {
            upstreamOrigin: upstreamUrl.origin,
            upstreamPath: `${upstreamUrl.pathname}${upstreamUrl.search}`,
          },
        },
      },
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
      "cache-control": "no-store",
    },
  });
}
