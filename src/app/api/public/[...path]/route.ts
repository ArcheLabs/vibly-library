import { NextRequest, NextResponse } from "next/server";

const COORDINATOR_URL =
  process.env.COORDINATOR_URL ??
  process.env.NEXT_PUBLIC_COORDINATOR_URL ??
  "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const upstream = new URL(
    `${COORDINATOR_URL}/api/public/${path.join("/")}`,
  );

  // Forward all query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    upstream.searchParams.set(key, value);
  });

  try {
    const res = await fetch(upstream.toString(), {
      next: { revalidate: 60 },
    });
    const data: unknown = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "UPSTREAM_ERROR", message: "Coordinator unreachable" } },
      { status: 502 },
    );
  }
}
