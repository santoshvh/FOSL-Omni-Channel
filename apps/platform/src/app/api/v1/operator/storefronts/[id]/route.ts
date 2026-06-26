import { NextResponse } from "next/server";
import { z } from "zod";
import { rotateStorefrontSecretKey, updateStorefrontSettings } from "@fosl/db";
import { requireRoles } from "@/lib/api-auth";
import { resolveOperatorIdForApi } from "@/lib/operator-session";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  customDomain: z.string().nullable().optional(),
  allowedOrigins: z.array(z.string().url()).optional(),
  rotateKeys: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  const operatorId = await resolveOperatorIdForApi(auth.session);
  if (!operatorId) {
    return NextResponse.json({ error: "Operator not found." }, { status: 404 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid update payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (parsed.data.rotateKeys) {
      const rotated = await rotateStorefrontSecretKey(id, operatorId);
      if (!rotated) {
        return NextResponse.json({ error: "Storefront not found." }, { status: 404 });
      }
      return NextResponse.json({
        data: {
          storefront: rotated.storefront,
          secretKey: rotated.secretKey,
        },
        source: "database",
      });
    }

    await updateStorefrontSettings(id, operatorId, {
      name: parsed.data.name,
      customDomain: parsed.data.customDomain,
      allowedOrigins: parsed.data.allowedOrigins,
    });

    return NextResponse.json({ data: { ok: true }, source: "database" });
  } catch (err) {
    console.error("[operator/storefronts/:id] patch failed:", err);
    return NextResponse.json({ error: "Unable to update storefront." }, { status: 500 });
  }
}
