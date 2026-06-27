import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { emptyListResponse } from "@/lib/database-required";
import { listCreatorLinksForUser } from "@fosl/db";

export async function GET() {
  const auth = await requireRoles("creator", "admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return emptyListResponse();
  }

  try {
    const userId = auth.session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Session required." }, { status: 401 });
    }

    const profile = await listCreatorLinksForUser(userId);
    if (!profile) {
      return NextResponse.json({ data: [], source: "database" });
    }

    return NextResponse.json({
      data: profile.links,
      profile: {
        id: profile.id,
        displayName: profile.displayName,
        referralCode: profile.referralCode,
      },
      source: "database",
    });
  } catch (err) {
    console.error("[creator/links] failed:", err);
    return NextResponse.json({ error: "Unable to load links." }, { status: 500 });
  }
}
