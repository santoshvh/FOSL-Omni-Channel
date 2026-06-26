import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { resolveOperatorIdForApi } from "@/lib/operator-session";

export async function GET() {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    const { products } = await import("@fosl/mocks");
    return NextResponse.json({
      data: products.filter((p) => p.published),
      source: "mock",
    });
  }

  try {
    const operatorId = await resolveOperatorIdForApi(auth.session);
    if (!operatorId) {
      return NextResponse.json({ error: "No operator workspace found." }, { status: 404 });
    }

    const { listOperatorProducts } = await import("@fosl/db");
    const data = await listOperatorProducts(operatorId);

    return NextResponse.json({ data, source: "database", operatorId });
  } catch (err) {
    console.error("[operator-catalog] failed:", err);
    return NextResponse.json({ error: "Unable to load catalog." }, { status: 500 });
  }
}
