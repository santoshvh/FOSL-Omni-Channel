import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { emptyListResponse } from "@/lib/database-required";
import { listContactSubmissions } from "@fosl/db";

export async function GET() {
  const auth = await requireRoles("admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return emptyListResponse();
  }

  try {
    const rows = await listContactSubmissions();
    const data = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      message: row.message,
      createdAt: row.createdAt.toISOString(),
    }));
    return NextResponse.json({ data, source: "database" });
  } catch (err) {
    console.error("[admin/contact-submissions] failed:", err);
    return NextResponse.json({ error: "Unable to load contact submissions." }, { status: 500 });
  }
}
