import { NextResponse } from "next/server";
import { getProductById } from "@fosl/mocks";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
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
          (await resolveOperatorId({ operatorId: operatorIdParam, storefrontPath })) ??
          (await getDefaultOperatorId());

        if (!operatorId) {
          return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }

        const data = await getOperatorProduct(operatorId, id);
        if (!data) {
          return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }
        return NextResponse.json({ data, source: "database", scope: "operator", operatorId });
      }

      const data = await getNetworkProduct(id);
      if (!data) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
      }
      return NextResponse.json({ data, source: "database", scope: "network" });
    }
  } catch (err) {
    console.error("[products/:id] failed:", err);
  }

  const mock = getProductById(id);
  if (!mock) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ data: mock, source: "mock", scope });
}
