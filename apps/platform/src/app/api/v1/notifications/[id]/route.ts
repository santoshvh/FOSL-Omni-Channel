import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth-secret";
import { deleteNotification, markNotificationRead, prisma } from "@fosl/db";

async function resolveUserId(): Promise<string | null> {
  if (!process.env.DATABASE_URL?.trim()) return null;

  const session = await auth();
  if (session?.user?.id) return session.user.id;

  if (!isAuthEnabled()) {
    const demo = await prisma.user.findUnique({
      where: { email: "alex@acmecatalog.com" },
      select: { id: true },
    });
    return demo?.id ?? null;
  }

  return null;
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await resolveUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const row = await markNotificationRead(userId, id);
    if (!row) {
      return NextResponse.json({ error: "Notification not found." }, { status: 404 });
    }
    return NextResponse.json({ data: row, source: "database" });
  } catch (err) {
    console.error("[notifications/id] read failed:", err);
    return NextResponse.json({ error: "Unable to mark notification read." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await resolveUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const ok = await deleteNotification(userId, id);
    if (!ok) {
      return NextResponse.json({ error: "Notification not found." }, { status: 404 });
    }
    return NextResponse.json({ data: { deleted: true }, source: "database" });
  } catch (err) {
    console.error("[notifications/id] delete failed:", err);
    return NextResponse.json({ error: "Unable to delete notification." }, { status: 500 });
  }
}
