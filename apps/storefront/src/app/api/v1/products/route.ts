import { NextResponse } from "next/server";
import { products as mockProducts } from "@fosl/mocks/fixtures";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
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
          (await resolveOperatorId({ operatorId: operatorIdParam, storefrontPath })) ??
          (await getDefaultOperatorId());

        if (!operatorId) {
          return NextResponse.json({ data: [], source: "database", scope: "operator" });
        }

        const data = await listOperatorProducts(operatorId);
        return NextResponse.json({ data, source: "database", scope: "operator", operatorId });
      }

      const data = await listNetworkProducts();
      return NextResponse.json({ data, source: "database", scope: "network" });
    }
  } catch (err) {
    console.error("[products] failed:", err);
  }

  return NextResponse.json({ data: mockProducts, source: "mock", scope });
}
