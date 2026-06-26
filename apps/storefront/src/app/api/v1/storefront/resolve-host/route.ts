import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get("host")?.trim();
  if (!host) {
    return NextResponse.json({ error: "host query param required." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const { getStorefrontByCustomDomain } = await import("@fosl/db");
    const storefront = await getStorefrontByCustomDomain(host);
    if (!storefront) {
      return NextResponse.json({ error: "Unknown host." }, { status: 404 });
    }

    return NextResponse.json({
      data: { path: storefront.path, operatorId: storefront.operatorId, name: storefront.name },
      source: "database",
    });
  } catch (err) {
    console.error("[storefront/resolve-host] failed:", err);
    return NextResponse.json({ error: "Resolver failed." }, { status: 500 });
  }
}

/** Internal host resolver for middleware (requires x-fosl-internal header). */
export async function POST(request: Request) {
  const internal = request.headers.get("x-fosl-internal");
  const secret = process.env.FOSL_INTERNAL_SECRET?.trim();
  if (!secret || internal !== secret) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: { host?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const host = body.host?.trim();
  if (!host) {
    return NextResponse.json({ error: "host required." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { getStorefrontByCustomDomain } = await import("@fosl/db");
  const storefront = await getStorefrontByCustomDomain(host);
  if (!storefront) {
    return NextResponse.json({ error: "Unknown host." }, { status: 404 });
  }

  return NextResponse.json({
    data: { path: storefront.path, operatorId: storefront.operatorId },
    source: "database",
  });
}
