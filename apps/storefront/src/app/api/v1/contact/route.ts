import { NextResponse } from "next/server";

type ContactBody = {
  name?: string;
  email?: string;
  role?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const id = `contact_${Date.now()}`;

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@fosl/db");
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          role: body.role ?? "buyer",
          message,
        },
      });
    } catch (err) {
      console.error("[contact] database persist failed:", err);
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[contact]", { id, name, email, role: body.role, message });
  }

  return NextResponse.json(
    {
      data: {
        id,
        status: "received",
        name,
        email,
        role: body.role ?? "buyer",
      },
    },
    { status: 201 }
  );
}
