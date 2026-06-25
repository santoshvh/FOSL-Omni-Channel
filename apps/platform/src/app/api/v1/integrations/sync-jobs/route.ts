import { NextResponse } from "next/server";
import { fetchSyncJobs } from "@/lib/integrations-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const integrationId = searchParams.get("integrationId")?.trim() || undefined;

  try {
    const result = await fetchSyncJobs(integrationId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[sync-jobs] GET failed:", err);
    return NextResponse.json({ error: "Unable to load sync history." }, { status: 500 });
  }
}
