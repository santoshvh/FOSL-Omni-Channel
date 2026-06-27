import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { getAdminMetrics } from "@fosl/db";

export async function GET() {
  const auth = await requireRoles("admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({
      data: {
        operatorCount: 0,
        ordersLast30Days: 0,
        totalOrders: 0,
        revenueCentsLast30Days: 0,
        checkoutUptimePct: 0,
      },
      source: "unconfigured",
    });
  }

  try {
    const data = await getAdminMetrics();
    return NextResponse.json({ data, source: "database" });
  } catch (err) {
    console.error("[admin/metrics] failed:", err);
    return NextResponse.json({ error: "Unable to load metrics." }, { status: 500 });
  }
}
