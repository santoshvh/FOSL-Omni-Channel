import { NextResponse } from "next/server";
import { products as mockProducts } from "@fosl/mocks/fixtures";
import { corsHeadersForStorefront, withCors } from "../cors";
import { resolveStorefrontFromRequest } from "../resolve-storefront";

export async function handleSearchOptions(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  return new NextResponse(null, { status: 204, headers: corsHeadersForStorefront(request, storefront) });
}

export async function handleSearchGet(request: Request) {
  const { searchParams } = new URL(request.url);
  const { storefront } = await resolveStorefrontFromRequest(request, searchParams);
  const cors = corsHeadersForStorefront(request, storefront);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return withCors(NextResponse.json({ data: [], source: "empty" }), cors);
  }

  try {
    if (process.env.DATABASE_URL?.trim()) {
      const { searchNetworkProducts } = await import("@fosl/db");
      const data = await searchNetworkProducts(q);
      return withCors(NextResponse.json({ data, source: "database", query: q }), cors);
    }
  } catch (err) {
    console.error("[search] failed:", err);
  }

  const lower = q.toLowerCase();
  const data = mockProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(lower) ||
      p.vendorName.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
  );

  return withCors(NextResponse.json({ data, source: "mock", query: q }), cors);
}
