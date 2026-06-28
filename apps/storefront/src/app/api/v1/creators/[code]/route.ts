import { NextResponse } from "next/server";
import { getPublicCreatorByReferralCode } from "@fosl/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const profile = await getPublicCreatorByReferralCode(code);
    if (!profile) {
      return NextResponse.json({ error: "Creator not found." }, { status: 404 });
    }

    return NextResponse.json({ data: profile, source: "database" });
  } catch (err) {
    console.error("[creators/code] failed:", err);
    return NextResponse.json({ error: "Unable to load creator profile." }, { status: 500 });
  }
}
