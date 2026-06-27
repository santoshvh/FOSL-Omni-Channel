import { NextResponse } from "next/server";
import { products as mockProducts } from "@fosl/mocks/fixtures";
import { corsHeadersForStorefront, withCors } from "@/lib/cors";
import {
  operatorIdFromContext,
  resolveStorefrontFromRequest,
} from "@/lib/resolve-storefront-request";

export async function OPTIONS(request: Request) {
  const { storefront } = await resolveStorefrontFromRequest(request);
  return new NextResponse(null, { status: 204, headers: corsHeadersForStorefront(request, storefront) });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { storefront } = await resolveStorefrontFromRequest(request, searchParams);
  const cors = corsHeadersForStorefront(request, storefront);

  const scope = searchParams.get("scope")?.trim() || "network";
  const operatorIdParam = searchParams.get("operatorId");
  const storefrontPath = searchParams.get("storefrontPath");

  try {
    if (process.env.DATABASE_URL?.trim()) {
      const {
        listNetworkProducts,
        listOperatorProducts,
        resolveOperatorId,
        getDefaultOperatorId,
      } = await import("@fosl/db");

      if (scope === "operator") {
        const operatorId =
          storefront?.operatorId ??
          operatorIdFromContext({ storefront, publishableKey: null }) ??
          (await resolveOperatorId({ operatorId: operatorIdParam, storefrontPath })) ??
          (await getDefaultOperatorId());

        if (!operatorId) {
          return withCors(
            NextResponse.json({ data: [], source: "database", scope: "operator" }),
            cors
          );
        }

        let data = await listOperatorProducts(operatorId);
        const q = searchParams.get("q")?.trim().toLowerCase();
        if (q) {
          data = data.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.vendorName.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q)
          );
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

      const q = searchParams.get("q")?.trim();
      if (q) {
        const { searchNetworkProducts } = await import("@fosl/db");
        const data = await searchNetworkProducts(q);
        return withCors(
          NextResponse.json({ data, source: "database", scope: "network" }),
          cors
        );
      }

      const data = await listNetworkProducts();
      return withCors(
        NextResponse.json({ data, source: "database", scope: "network" }),
        cors
      );
    }
  } catch (err) {
    console.error("[products] failed:", err);
  }

  return withCors(
    NextResponse.json({ data: mockProducts, source: "mock", scope }),
    cors
  );
}
