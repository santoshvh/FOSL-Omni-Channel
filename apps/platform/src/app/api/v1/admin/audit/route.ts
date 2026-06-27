import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { emptyListResponse } from "@/lib/database-required";
import { listAuditLogs } from "@fosl/db";

export async function GET() {
  const auth = await requireRoles("admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return emptyListResponse();
  }

  try {
    const rows = await listAuditLogs();
    const data = rows.map((row) => ({
      id: row.id,
      timestamp: row.createdAt.toISOString(),
      actor: row.actorEmail ?? row.actorId ?? "system",
      action: row.action,
      resource: row.resource,
    }));
    return NextResponse.json({ data, source: "database" });
  } catch (err) {
    console.error("[admin/audit] failed:", err);
    return NextResponse.json({ error: "Unable to load audit log." }, { status: 500 });
  }
}
