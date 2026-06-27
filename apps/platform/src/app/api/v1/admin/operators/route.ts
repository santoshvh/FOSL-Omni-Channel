import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { listAdminOperators } from "@fosl/db";
import { emptyListResponse } from "@/lib/database-required";

export async function GET() {
  const auth = await requireRoles("admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return emptyListResponse();
  }

  try {
    const data = await listAdminOperators();
    return NextResponse.json({ data, source: "database" });
  } catch (err) {
    console.error("[admin/operators] failed:", err);
    return NextResponse.json({ error: "Unable to load operators." }, { status: 500 });
  }
}
