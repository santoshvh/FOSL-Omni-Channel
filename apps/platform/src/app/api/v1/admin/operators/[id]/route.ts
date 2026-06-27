import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { databaseRequiredResponse } from "@/lib/database-required";
import { getAdminOperatorById } from "@fosl/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRoles("admin");
  if (auth.error) return auth.error;

  const { id } = await params;

  const blocked = databaseRequiredResponse();
  if (blocked) return blocked;

  try {
    const data = await getAdminOperatorById(id);
    if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ data, source: "database" });
  } catch (err) {
    console.error("[admin/operators] detail failed:", err);
    return NextResponse.json({ error: "Unable to load operator." }, { status: 500 });
  }
}
