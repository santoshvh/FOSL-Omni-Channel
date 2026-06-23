import { NextResponse } from "next/server";
import { commissionPayoutJobSchema } from "@fosl/contracts";
import {
  assertPayoutJobAuthorized,
  processCreatorCommissionPayouts,
} from "@/lib/commission-payouts";

export async function POST(request: Request) {
  try {
    assertPayoutJobAuthorized(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown = {};
  try {
    const text = await request.text();
    if (text) body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = commissionPayoutJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payout payload." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      data: { results: [], source: "mock", message: "DATABASE_URL not set." },
    });
  }

  try {
    const results = await processCreatorCommissionPayouts({
      creatorId: parsed.data.creatorId,
    });

    return NextResponse.json({
      data: {
        source: "database",
        paid: results.filter((result) => result.status === "paid").length,
        skipped: results.filter((result) => result.status === "skipped").length,
        failed: results.filter((result) => result.status === "failed").length,
        results,
      },
    });
  } catch (err) {
    console.error("[payouts/commissions] failed:", err);
    return NextResponse.json({ error: "Commission payout job failed." }, { status: 500 });
  }
}
