import { NextResponse } from "next/server";
import { getProductById } from "@fosl/mocks";
import { corsHeadersForStorefront, withCors } from "@/lib/cors";
import { resolveStorefrontFromRequest } from "@/lib/resolve-storefront-request";

export async function OPTIONS(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  return new NextResponse(null, { status: 204, headers: corsHeadersForStorefront(request, storefront) });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const { storefront } = await resolveStorefrontFromRequest(request, searchParams);
  const cors = corsHeadersForStorefront(request, storefront);

  const scope = searchParams.get("scope")?.trim() || "network";
  const operatorIdParam = searchParams.get("operatorId");
  const storefrontPath = searchParams.get("storefrontPath");

  try {
    if (process.env.DATABASE_URL?.trim()) {
      const {
        getNetworkProduct,
        getOperatorProduct,
        resolveOperatorId,
        getDefaultOperatorId,
      } = await import("@fosl/db");

      if (scope === "operator") {
        const operatorId =
          storefront?.operatorId ??
          (await resolveOperatorId({ operatorId: operatorIdParam, storefrontPath })) ??
          (await getDefaultOperatorId());

        if (!operatorId) {
          return withCors(NextResponse.json({ error: "Product not found." }, { status: 404 }), cors);
        }

        const data = await getOperatorProduct(operatorId, id);
        if (!data) {
          return withCors(NextResponse.json({ error: "Product not found." }, { status: 404 }), cors);
        }
        return withCors(
          NextResponse.json({
            data,
            source: "database",
            scope: "operator",
            operatorId,
            storefrontId: storefront?.id,
          }),
          cors
        );
      }

      const data = await getNetworkProduct(id);
      if (!data) {
        return withCors(NextResponse.json({ error: "Product not found." }, { status: 404 }), cors);
      }
      return withCors(NextResponse.json({ data, source: "database", scope: "network" }), cors);
    }
  } catch (err) {
    console.error("[products/:id] failed:", err);
  }

  const mock = getProductById(id);
  if (!mock) {
    return withCors(NextResponse.json({ error: "Product not found." }, { status: 404 }), cors);
  }
  return withCors(NextResponse.json({ data: mock, source: "mock", scope }), cors);
}
