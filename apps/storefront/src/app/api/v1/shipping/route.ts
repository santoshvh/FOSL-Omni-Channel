import { NextResponse } from "next/server";
import { getShippingForVendor } from "@fosl/mocks";
import { listShippingMethodsForVendor } from "@fosl/db";
import { corsHeadersForStorefront, withCors } from "@/lib/cors";
import { resolveStorefrontFromRequest } from "@/lib/resolve-storefront-request";

export async function OPTIONS(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  return new NextResponse(null, { status: 204, headers: corsHeadersForStorefront(request, storefront) });
}

export async function GET(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  const cors = corsHeadersForStorefront(request, storefront);
  const vendorId = new URL(request.url).searchParams.get("vendorId")?.trim();

  if (!vendorId) {
    return withCors(
      NextResponse.json({ error: "vendorId query parameter is required." }, { status: 400 }),
      cors
    );
  }

  if (process.env.DATABASE_URL) {
    try {
      const data = await listShippingMethodsForVendor(vendorId);
      return withCors(NextResponse.json({ data, source: "database" }), cors);
    } catch (err) {
      console.error("[shipping] list failed:", err);
    }
  }

  return withCors(
    NextResponse.json({ data: getShippingForVendor(vendorId), source: "mock" }),
    cors
  );
}
