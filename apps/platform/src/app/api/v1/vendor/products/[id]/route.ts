import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRoles } from "@/lib/api-auth";
import { databaseRequiredResponse } from "@/lib/database-required";
import { resolveVendorIdForApi } from "@/lib/tenant-session";
import { getVendorProduct, updateVendorProduct } from "@fosl/db";

const updateProductSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  priceCents: z.number().int().nonnegative().optional(),
  inventory: z.number().int().nonnegative().optional(),
  published: z.boolean().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRoles("vendor", "admin");
  if (auth.error) return auth.error;

  const { id } = await params;

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  try {
    const vendorId = await resolveVendorIdForApi(auth.session);
    if (!vendorId) {
      return NextResponse.json({ error: "No vendor workspace found." }, { status: 404 });
    }

    const data = await getVendorProduct(vendorId, id);
    if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ data, source: "database" });
  } catch (err) {
    console.error("[vendor-products] get failed:", err);
    return NextResponse.json({ error: "Unable to load product." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRoles("vendor", "admin");
  if (auth.error) return auth.error;

  const { id } = await params;

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  try {
    const vendorId = await resolveVendorIdForApi(auth.session);
    if (!vendorId) {
      return NextResponse.json({ error: "No vendor workspace found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = await updateVendorProduct(vendorId, id, parsed.data);
    if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ data, source: "database" });
  } catch (err) {
    console.error("[vendor-products] update failed:", err);
    return NextResponse.json({ error: "Unable to update product." }, { status: 500 });
  }
}
