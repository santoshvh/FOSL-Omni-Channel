import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { resolveOperatorIdForApi } from "@/lib/operator-session";

export async function GET() {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    const { operatorVendors } = await import("@fosl/mocks");
    return NextResponse.json({ data: operatorVendors, source: "mock" });
  }

  try {
    const operatorId = await resolveOperatorIdForApi(auth.session);
    if (!operatorId) {
      return NextResponse.json({ error: "No operator workspace found." }, { status: 404 });
    }

    const { listOperatorVendorLinks } = await import("@fosl/db");
    const rows = await listOperatorVendorLinks(operatorId);

    const data = rows.map((row) => ({
      id: row.id,
      vendorId: row.vendorId,
      name: row.vendor.name,
      slug: row.vendor.slug,
      status: row.status.toLowerCase(),
      commissionPct: Number(row.defaultCommissionPct ?? row.minCommissionPct),
      productsListed: row.vendor._count.products,
      integration: "native",
      revenueCents: 0,
    }));

    return NextResponse.json({ data, source: "database", operatorId });
  } catch (err) {
    console.error("[operator-vendors] list failed:", err);
    return NextResponse.json({ error: "Unable to load vendor relationships." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  let body: { vendorId?: string; minCommissionPct?: number; defaultCommissionPct?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.vendorId?.trim()) {
    return NextResponse.json({ error: "vendorId is required." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ data: { status: "pending" }, source: "mock" }, { status: 201 });
  }

  try {
    const operatorId = await resolveOperatorIdForApi(auth.session);
    if (!operatorId) {
      return NextResponse.json({ error: "No operator workspace found." }, { status: 404 });
    }

    const { inviteVendorToOperator } = await import("@fosl/db");
    const link = await inviteVendorToOperator({
      operatorId,
      vendorId: body.vendorId.trim(),
      minCommissionPct: body.minCommissionPct,
      defaultCommissionPct: body.defaultCommissionPct,
    });

    return NextResponse.json(
      {
        data: {
          id: link.id,
          vendorId: link.vendorId,
          name: link.vendor.name,
          status: link.status.toLowerCase(),
        },
        source: "database",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[operator-vendors] invite failed:", err);
    return NextResponse.json({ error: "Unable to invite vendor." }, { status: 500 });
  }
}
