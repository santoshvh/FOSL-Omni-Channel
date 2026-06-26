import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createOperatorStorefront,
  listOperatorStorefronts,
} from "@fosl/db";
import { requireRoles } from "@/lib/api-auth";
import { resolveOperatorIdForApi } from "@/lib/operator-session";

const createStorefrontSchema = z.object({
  name: z.string().min(1),
  path: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Path must be lowercase letters, numbers, and hyphens."),
  customDomain: z.string().optional().nullable(),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  const operatorId = await resolveOperatorIdForApi(auth.session);
  if (!operatorId) {
    return NextResponse.json({ error: "Operator not found." }, { status: 404 });
  }

  try {
    const data = await listOperatorStorefronts(operatorId);
    return NextResponse.json({
      data: data.map((sf) => ({
        id: sf.id,
        name: sf.name,
        path: sf.path,
        customDomain: sf.customDomain,
        isDefault: sf.isDefault,
        publishableKey: sf.publishableKey,
        allowedOrigins: sf.allowedOrigins,
        operator: sf.operator,
        payments: {
          model: sf.operator.stripeConnectId ? "operator_connect" : "platform",
          stripeConnectConfigured: Boolean(sf.operator.stripeConnectId),
        },
      })),
      source: "database",
    });
  } catch (err) {
    console.error("[operator/storefronts] list failed:", err);
    return NextResponse.json({ error: "Unable to load storefronts." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  const operatorId = await resolveOperatorIdForApi(auth.session);
  if (!operatorId) {
    return NextResponse.json({ error: "Operator not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createStorefrontSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid storefront payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const result = await createOperatorStorefront({
      operatorId,
      name: parsed.data.name,
      path: parsed.data.path,
      customDomain: parsed.data.customDomain,
      isDefault: parsed.data.isDefault,
    });

    return NextResponse.json(
      {
        data: {
          storefront: result.storefront,
          secretKey: result.secretKey,
        },
        source: "database",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[operator/storefronts] create failed:", err);
    return NextResponse.json({ error: "Unable to create storefront." }, { status: 500 });
  }
}
