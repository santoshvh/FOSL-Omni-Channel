import { NextResponse } from "next/server";
import type { ApprovalStatus } from "@prisma/client";
import { requireRoles } from "@/lib/api-auth";
import { databaseRequiredResponse } from "@/lib/database-required";
import { resolveOperatorIdForApi } from "@/lib/operator-session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  const { id } = await params;

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  try {
    const operatorId = await resolveOperatorIdForApi(auth.session);
    if (!operatorId) {
      return NextResponse.json({ error: "No operator workspace found." }, { status: 404 });
    }

    const { getOperatorVendorLinkById } = await import("@fosl/db");
    const row = await getOperatorVendorLinkById(id);

    if (!row || row.operatorId !== operatorId) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const data = {
      id: row.id,
      vendorId: row.vendorId,
      name: row.vendor.name,
      slug: row.vendor.slug,
      status: row.status.toLowerCase(),
      commissionPct: Number(row.defaultCommissionPct ?? row.minCommissionPct),
      productsListed: row.vendor._count.products,
      integration: "native",
      revenueCents: 0,
      operatorName: row.operator.name,
    };

    return NextResponse.json({ data, source: "database" });
  } catch (err) {
    console.error("[operator-vendors/:id] get failed:", err);
    return NextResponse.json({ error: "Unable to load vendor relationship." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRoles("operator", "admin");
  if (auth.error) return auth.error;

  const { id } = await params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const status = body.status?.trim().toUpperCase();
  if (!status || !["PENDING", "APPROVED", "SUSPENDED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Valid status is required." }, { status: 400 });
  }

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  try {
    const operatorId = await resolveOperatorIdForApi(auth.session);
    if (!operatorId) {
      return NextResponse.json({ error: "No operator workspace found." }, { status: 404 });
    }

    const { getOperatorVendorLinkById, updateOperatorVendorStatus } = await import("@fosl/db");
    const existing = await getOperatorVendorLinkById(id);

    if (!existing || existing.operatorId !== operatorId) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const updated = await updateOperatorVendorStatus(id, status as ApprovalStatus);

    return NextResponse.json({
      data: {
        id: updated.id,
        status: updated.status.toLowerCase(),
        name: updated.vendor.name,
      },
      source: "database",
    });
  } catch (err) {
    console.error("[operator-vendors/:id] patch failed:", err);
    return NextResponse.json({ error: "Unable to update vendor relationship." }, { status: 500 });
  }
}
