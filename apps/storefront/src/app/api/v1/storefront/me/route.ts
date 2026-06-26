import { NextResponse } from "next/server";
import { corsHeadersForStorefront, withCors } from "@/lib/cors";
import { resolveStorefrontFromRequest } from "@/lib/resolve-storefront-request";

export async function OPTIONS(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  return new NextResponse(null, { status: 204, headers: corsHeadersForStorefront(request, storefront) });
}

/** Resolve storefront from publishable key or Host header (headless clients). */
export async function GET(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  const cors = corsHeadersForStorefront(request, storefront);

  if (!storefront) {
    return withCors(NextResponse.json({ error: "Storefront not found." }, { status: 404 }), cors);
  }

  return withCors(
    NextResponse.json({
      data: {
        id: storefront.id,
        path: storefront.path,
        name: storefront.name,
        customDomain: storefront.customDomain,
        publishableKey: storefront.publishableKey,
        operator: storefront.operator,
        payments: {
          model: storefront.operator.stripeConnectId ? "operator_connect" : "platform",
          stripeConnectConfigured: Boolean(storefront.operator.stripeConnectId),
        },
      },
      source: "database",
    }),
    cors
  );
}
