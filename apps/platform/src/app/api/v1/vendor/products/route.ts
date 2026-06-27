import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRoles } from "@/lib/api-auth";
import { databaseRequiredResponse, emptyListResponse } from "@/lib/database-required";
import { resolveVendorIdForApi } from "@/lib/tenant-session";
import { createVendorProduct, listVendorProducts } from "@fosl/db";

const createProductSchema = z.object({
  sku: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["physical", "digital", "lead_gen"]).default("physical"),
  priceCents: z.number().int().nonnegative(),
  inventory: z.number().int().nonnegative().optional(),
  category: z.string().optional(),
  imageUrl: z.string().url().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireRoles("vendor", "admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return emptyListResponse();
  }

  try {
    const vendorId = await resolveVendorIdForApi(auth.session);
    if (!vendorId) {
      return NextResponse.json({ error: "No vendor workspace found." }, { status: 404 });
    }

    const data = await listVendorProducts(vendorId);
    return NextResponse.json({ data, source: "database", vendorId });
  } catch (err) {
    console.error("[vendor-products] list failed:", err);
    return NextResponse.json({ error: "Unable to load catalog." }, { status: 500 });
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
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = await createVendorProduct(vendorId, parsed.data);
    return NextResponse.json({ data, source: "database" }, { status: 201 });
  } catch (err) {
    console.error("[vendor-products] create failed:", err);
    return NextResponse.json({ error: "Unable to create product." }, { status: 500 });
  }
}
