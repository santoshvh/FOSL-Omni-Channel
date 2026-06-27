import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { fetchSyncJobDetail } from "@/lib/integrations-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRoles("vendor", "admin");
  if (auth.error) return auth.error;

  const { id } = await params;

  try {
    const { data, source } = await fetchSyncJobDetail(id);
    if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ data, source });
  } catch (err) {
    console.error("[sync-jobs] detail failed:", err);
    return NextResponse.json({ error: "Unable to load sync job." }, { status: 500 });
  }
}
