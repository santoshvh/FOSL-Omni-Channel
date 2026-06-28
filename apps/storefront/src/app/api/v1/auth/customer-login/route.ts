import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { compare } from "bcryptjs";
import { prisma } from "@fosl/db";
import {
  COOKIE_NAME,
  createCustomerSessionToken,
  customerSessionCookieOptions,
  parseCustomerSessionToken,
} from "@/lib/customer-auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    if (process.env.NODE_ENV === "development" && password === "demo123") {
      const token = createCustomerSessionToken({
        userId: `guest_${email}`,
        email,
        name: email.split("@")[0] ?? "Customer",
      });
      const res = NextResponse.json({ data: { email, name: email.split("@")[0] } });
      res.cookies.set(customerSessionCookieOptions(token));
      return res;
    }
    return NextResponse.json({ error: "Sign-in is unavailable." }, { status: 503 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = createCustomerSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name ?? user.email,
    });

    const res = NextResponse.json({
      data: { email: user.email, name: user.name ?? user.email },
      source: "database",
    });
    res.cookies.set(customerSessionCookieOptions(token));
    return res;
  } catch (err) {
    console.error("[customer-login] failed:", err);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}

export async function GET() {
  const jar = await cookies();
  const session = parseCustomerSessionToken(jar.get(COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ data: null });
  }
  return NextResponse.json({ data: session });
}

export async function DELETE() {
  const res = NextResponse.json({ data: { signedOut: true } });
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
