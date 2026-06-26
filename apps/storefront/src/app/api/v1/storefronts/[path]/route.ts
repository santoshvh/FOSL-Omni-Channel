import { NextResponse } from "next/server";
import { corsHeadersForStorefront, withCors } from "@/lib/cors";
import { resolveStorefrontFromRequest } from "@/lib/resolve-storefront-request";

export async function OPTIONS(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  return new NextResponse(null, { status: 204, headers: corsHeadersForStorefront(request, storefront) });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string }> }
) {
  const { path } = await params;
  const { storefront: fromRequest } = await resolveStorefrontFromRequest(request);
  const cors = corsHeadersForStorefront(request, fromRequest);

  if (!process.env.DATABASE_URL?.trim()) {
    return withCors(NextResponse.json({ error: "Storefront not found." }, { status: 404 }), cors);
  }

  try {
    const { resolveStorefront } = await import("@fosl/db");
    const storefront =
      fromRequest?.path === path
        ? fromRequest
        : await resolveStorefront({ storefrontPath: path });

    if (!storefront) {
      return withCors(NextResponse.json({ error: "Storefront not found." }, { status: 404 }), cors);
    }

    return withCors(
      NextResponse.json({
        data: {
          id: storefront.id,
          path: storefront.path,
          name: storefront.name,
          isDefault: storefront.isDefault,
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
  } catch (err) {
    console.error("[storefronts/:path] failed:", err);
    return withCors(
      NextResponse.json({ error: "Unable to load storefront." }, { status: 500 }),
      cors
    );
  }
}
