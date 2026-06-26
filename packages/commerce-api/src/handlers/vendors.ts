import { NextResponse } from "next/server";
import { marketplaceVendors } from "@fosl/mocks";
import { corsHeadersForStorefront, withCors } from "../cors";
import { resolveStorefrontFromRequest } from "../resolve-storefront";

export async function handleVendorsOptions(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  return new NextResponse(null, { status: 204, headers: corsHeadersForStorefront(request, storefront) });
}

export async function handleVendorsGet(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  const cors = corsHeadersForStorefront(request, storefront);

  try {
    if (process.env.DATABASE_URL?.trim()) {
      const { listNetworkVendors } = await import("@fosl/db");
      const data = await listNetworkVendors();
      return withCors(NextResponse.json({ data, source: "database" }), cors);
    }
  } catch (err) {
    console.error("[vendors] failed:", err);
  }

  return withCors(
    NextResponse.json({
      data: marketplaceVendors.map((v) => ({
        id: v.id,
        name: v.name,
        slug: v.slug,
        tagline: v.tagline,
        logoUrl: v.logoUrl,
        bannerUrl: v.bannerUrl,
        productCount: v.productCount,
        rating: v.rating,
        reviewCount: v.reviewCount,
        storefrontUrl: v.storefrontUrl,
      })),
      source: "mock",
    }),
    cors
  );
}
