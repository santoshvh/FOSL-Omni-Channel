import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { getCommissionTotalsForCreator, listCommissionsForCreator } from "@fosl/db";
import { resolveCreatorProfileIdForApi } from "@/lib/tenant-session";

export async function GET() {
  const auth = await requireRoles("creator", "admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({
      data: { pendingCents: 0, clearedCents: 0, paidCents: 0 },
      commissions: [],
      source: "unconfigured",
    });
  }

  try {
    const creatorId = await resolveCreatorProfileIdForApi(auth.session);
    if (!creatorId) {
      return NextResponse.json({ data: { pendingCents: 0, clearedCents: 0, paidCents: 0 }, commissions: [] });
    }

    const [totals, commissions] = await Promise.all([
      getCommissionTotalsForCreator(creatorId),
      listCommissionsForCreator(creatorId),
    ]);

    return NextResponse.json({
      data: {
        pendingCents: totals.pending ?? 0,
        clearedCents: totals.cleared ?? 0,
        paidCents: totals.paid ?? 0,
      },
      commissions,
      source: "database",
    });
  } catch (err) {
    console.error("[creator/commissions] failed:", err);
    return NextResponse.json({ error: "Unable to load commissions." }, { status: 500 });
  }
}
