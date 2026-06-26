import { NextResponse } from "next/server";
import { marketplaceCategories, marketplaceVendors } from "@fosl/mocks";
import { corsHeadersForStorefront, withCors } from "../cors";
import { resolveStorefrontFromRequest } from "../resolve-storefront";

export async function handleCategoriesOptions(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  return new NextResponse(null, { status: 204, headers: corsHeadersForStorefront(request, storefront) });
}

export async function handleCategoriesGet(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  const cors = corsHeadersForStorefront(request, storefront);

  try {
    if (process.env.DATABASE_URL?.trim()) {
      const { listNetworkCategories } = await import("@fosl/db");
      const data = await listNetworkCategories();
      return withCors(NextResponse.json({ data, source: "database" }), cors);
    }
  } catch (err) {
    console.error("[categories] failed:", err);
  }

  return withCors(
    NextResponse.json({
      data: marketplaceCategories.map((c) => ({
        slug: c.slug,
        name: c.name,
        productCount: c.productCount,
      })),
      source: "mock",
    }),
    cors
  );
}
