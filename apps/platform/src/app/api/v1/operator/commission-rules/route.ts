import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRoles } from "@/lib/api-auth";
import { resolveOperatorIdForApi } from "@/lib/tenant-session";
import { databaseRequiredResponse } from "@/lib/database-required";
import { getOperatorCommissionRules, saveOperatorCommissionRules } from "@fosl/db";

const rulesSchema = z.object({
  platformFeePct: z.number().min(0).max(100),
  creatorPct: z.number().min(0).max(100),
  operatorPct: z.number().min(0).max(100),
  skuOverrides: z.array(
    z.object({
      sku: z.string().min(1),
      creatorPct: z.number().min(0).max(100),
    })
  ),
});

export async function GET() {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  try {
    const operatorId = await resolveOperatorIdForApi(auth.session);
    if (!operatorId) {
      return NextResponse.json({ error: "No operator workspace found." }, { status: 404 });
    }
    const data = await getOperatorCommissionRules(operatorId);
    return NextResponse.json({ data, source: "database", operatorId });
  } catch (err) {
    console.error("[operator/commission-rules] get failed:", err);
    return NextResponse.json({ error: "Unable to load commission rules." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  try {
    const operatorId = await resolveOperatorIdForApi(auth.session);
    if (!operatorId) {
      return NextResponse.json({ error: "No operator workspace found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = rulesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const total =
      parsed.data.platformFeePct + parsed.data.creatorPct + parsed.data.operatorPct;
    if (total > 100) {
      return NextResponse.json(
        { error: "Platform fee, creator, and operator shares cannot exceed 100%." },
        { status: 400 }
      );
    }

    const data = await saveOperatorCommissionRules(operatorId, parsed.data);
    return NextResponse.json({ data, source: "database" });
  } catch (err) {
    console.error("[operator/commission-rules] save failed:", err);
    return NextResponse.json({ error: "Unable to save commission rules." }, { status: 500 });
  }
}
