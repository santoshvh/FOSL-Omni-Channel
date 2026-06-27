import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRoles } from "@/lib/api-auth";
import { resolveVendorIdForApi } from "@/lib/tenant-session";
import { databaseRequiredResponse } from "@/lib/database-required";
import { deleteShippingMethod, updateShippingMethod } from "@fosl/db";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  priceCents: z.number().int().nonnegative().optional(),
  estimatedDays: z.string().min(1).optional(),
  zone: z.string().min(1).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRoles("vendor", "admin");
  if (auth.error) return auth.error;

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  const { id } = await params;

  try {
    const vendorId = await resolveVendorIdForApi(auth.session);
    if (!vendorId) {
      return NextResponse.json({ error: "No vendor workspace found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const row = await updateShippingMethod(vendorId, id, parsed.data);
    if (!row) return NextResponse.json({ error: "Not found." }, { status: 404 });

    return NextResponse.json({
      data: {
        id: row.id,
        vendorId: row.vendorId,
        name: row.name,
        priceCents: row.priceCents,
        estimatedDays: row.estimatedDays,
        zone: row.zone,
      },
      source: "database",
    });
  } catch (err) {
    console.error("[vendor/shipping] update failed:", err);
    return NextResponse.json({ error: "Unable to update shipping method." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRoles("vendor", "admin");
  if (auth.error) return auth.error;

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  const { id } = await params;

  try {
    const vendorId = await resolveVendorIdForApi(auth.session);
    if (!vendorId) {
      return NextResponse.json({ error: "No vendor workspace found." }, { status: 404 });
    }

    const ok = await deleteShippingMethod(vendorId, id);
    if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[vendor/shipping] delete failed:", err);
    return NextResponse.json({ error: "Unable to delete shipping method." }, { status: 500 });
  }
}
