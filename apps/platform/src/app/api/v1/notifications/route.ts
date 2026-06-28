import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAuthEnabled } from "@/lib/auth-secret";
import {
  countUnreadNotifications,
  deleteAllNotifications,
  listUserNotifications,
  markAllNotificationsRead,
  prisma,
} from "@fosl/db";

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

export async function GET() {
  const userId = await resolveUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [items, unreadCount] = await Promise.all([
      listUserNotifications(userId),
      countUnreadNotifications(userId),
    ]);
    return NextResponse.json({ data: items, unreadCount, source: "database" });
  } catch (err) {
    console.error("[notifications] list failed:", err);
    return NextResponse.json({ error: "Unable to load notifications." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const userId = await resolveUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.action !== "read_all") {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  try {
    const updated = await markAllNotificationsRead(userId);
    return NextResponse.json({ data: { updated }, source: "database" });
  } catch (err) {
    console.error("[notifications] read all failed:", err);
    return NextResponse.json({ error: "Unable to mark notifications read." }, { status: 500 });
  }
}

export async function DELETE() {
  const userId = await resolveUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cleared = await deleteAllNotifications(userId);
    return NextResponse.json({ data: { cleared }, source: "database" });
  } catch (err) {
    console.error("[notifications] clear all failed:", err);
    return NextResponse.json({ error: "Unable to clear notifications." }, { status: 500 });
  }
}
