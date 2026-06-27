import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { emptyListResponse } from "@/lib/database-required";
import { listDisputes } from "@fosl/db";

export async function GET() {
  const auth = await requireRoles("admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return emptyListResponse();
  }

  try {
    const rows = await listDisputes();
    const data = rows.map((d) => ({
      id: d.id,
      orderNumber: d.orderNumber,
      parties: d.parties,
      status: d.status,
      filedAt: d.filedAt.toISOString(),
      assignee: d.assignee ?? undefined,
    }));
    return NextResponse.json({ data, source: "database" });
  } catch (err) {
    console.error("[admin/disputes] failed:", err);
    return NextResponse.json({ error: "Unable to load disputes." }, { status: 500 });
  }
}
