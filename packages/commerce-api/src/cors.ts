import { storefrontAllowedOrigins } from "@fosl/db";
import type { ResolvedStorefront } from "@fosl/db";

const NETWORK_ORIGINS = [
  "https://shop.foslone.com",
  "https://api.foslone.com",
  "http://localhost:3001",
  "http://localhost:3002",
];

export function corsHeadersForStorefront(
  request: Request,
  storefront: ResolvedStorefront | null
): HeadersInit {
  const origin = request.headers.get("origin");
  if (!origin) return {};

  const allowed = new Set<string>(NETWORK_ORIGINS);
  if (storefront) {
    for (const o of storefrontAllowedOrigins(storefront)) {
      allowed.add(o);
    }
    if (storefront.customDomain) {
      allowed.add(`https://${storefront.customDomain}`);
      allowed.add(`http://${storefront.customDomain}`);
    }
  }

  if (!allowed.has(origin)) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export function withCors(response: Response, cors: HeadersInit) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(cors)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function corsOptions(request: Request, storefront: ResolvedStorefront | null) {
  return new Response(null, { status: 204, headers: corsHeadersForStorefront(request, storefront) });
}
