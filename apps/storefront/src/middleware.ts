import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIMARY_HOSTS = new Set([
  "shop.foslone.com",
  "api.foslone.com",
  "localhost",
  "127.0.0.1",
]);

function normalizeHost(host: string | null) {
  return host?.split(":")[0]?.toLowerCase().trim() ?? "";
}

async function resolveStorefrontPath(host: string): Promise<string | null> {
  const secret = process.env.FOSL_INTERNAL_SECRET?.trim();
  const internalOrigin =
    process.env.STOREFRONT_INTERNAL_ORIGIN?.trim() ??
    process.env.NEXT_PUBLIC_STOREFRONT_URL?.trim() ??
    "http://127.0.0.1:3001";

  if (!secret) return null;

  try {
    const res = await fetch(`${internalOrigin.replace(/\/$/, "")}/api/v1/storefront/resolve-host`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-fosl-internal": secret,
      },
      body: JSON.stringify({ host }),
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { path?: string } };
    return json.data?.path ?? null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const host = normalizeHost(
    request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  );

  if (!host || PRIMARY_HOSTS.has(host)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const storefrontPath = await resolveStorefrontPath(host);
  if (!storefrontPath) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const path = url.pathname === "/" ? "" : url.pathname;
  url.pathname = `/${storefrontPath}${path}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
