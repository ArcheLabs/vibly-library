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

  const upstream = await fetch(upstreamUrl.toString(), {
    cache: "no-store",
    headers: {
      ...versionHeaders(),
      accept: request.headers.get("accept") ?? "application/json",
    },
  });

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
      "cache-control": "no-store",
    },
  });
}
