import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRoles } from "@/lib/api-auth";
import { resolveVendorIdForApi } from "@/lib/tenant-session";
import { databaseRequiredResponse } from "@/lib/database-required";
import { createShippingMethod, listShippingMethodsForVendor } from "@fosl/db";

const createSchema = z.object({
  name: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  estimatedDays: z.string().min(1),
  zone: z.string().min(1),
});

export async function GET() {
  const auth = await requireRoles("vendor", "admin");
  if (auth.error) return auth.error;

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  try {
    const vendorId = await resolveVendorIdForApi(auth.session);
    if (!vendorId) {
      return NextResponse.json({ error: "No vendor workspace found." }, { status: 404 });
    }
    const data = await listShippingMethodsForVendor(vendorId);
    return NextResponse.json({ data, source: "database", vendorId });
  } catch (err) {
    console.error("[vendor/shipping] list failed:", err);
    return NextResponse.json({ error: "Unable to load shipping methods." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireRoles("vendor", "admin");
  if (auth.error) return auth.error;

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  try {
    const vendorId = await resolveVendorIdForApi(auth.session);
    if (!vendorId) {
      return NextResponse.json({ error: "No vendor workspace found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const row = await createShippingMethod(vendorId, parsed.data);
    return NextResponse.json(
      {
        data: {
          id: row.id,
          vendorId: row.vendorId,
          name: row.name,
          priceCents: row.priceCents,
          estimatedDays: row.estimatedDays,
          zone: row.zone,
        },
        source: "database",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[vendor/shipping] create failed:", err);
    return NextResponse.json({ error: "Unable to create shipping method." }, { status: 500 });
  }
}
