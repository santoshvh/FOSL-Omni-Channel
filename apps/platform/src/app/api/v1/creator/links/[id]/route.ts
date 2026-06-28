import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/api-auth";
import { setCreatorLinkFeatured } from "@fosl/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRoles("creator", "admin");
  if (auth.error) return auth.error;

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { id } = await params;
  let body: { featured?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body.featured !== "boolean") {
    return NextResponse.json({ error: "featured boolean is required." }, { status: 400 });
  }

  const userId = auth.session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Session required." }, { status: 401 });
  }

  try {
    const link = await setCreatorLinkFeatured(userId, id, body.featured);
    if (!link) {
      return NextResponse.json({ error: "Link not found." }, { status: 404 });
    }
    return NextResponse.json({ data: link, source: "database" });
  } catch (err) {
    console.error("[creator/links/id] patch failed:", err);
    return NextResponse.json({ error: "Unable to update link." }, { status: 500 });
  }
}
