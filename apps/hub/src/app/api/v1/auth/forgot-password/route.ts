import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@fosl/contracts";
import { issuePasswordResetToken } from "@fosl/db";
import { sendPasswordResetEmail } from "@/lib/email";

const GENERIC_MESSAGE =
  "If an account exists for that email, we sent password reset instructions.";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Enter a valid email address.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();

  if (!process.env.DATABASE_URL) {
    const hubUrl = process.env.AUTH_URL ?? "http://localhost:3000";
    const resetUrl = `${hubUrl}/auth/reset-password?email=${encodeURIComponent(email)}&token=demo_reset_token`;
    await sendPasswordResetEmail({ to: email, resetUrl }).catch((err) => {
      console.error("[forgot-password] email failed:", err);
    });
    return NextResponse.json({ data: { message: GENERIC_MESSAGE, mode: "mock" } });
  }

  try {
    const issued = await issuePasswordResetToken(email);

    if (issued) {
      const hubUrl = process.env.AUTH_URL ?? "http://localhost:3000";
      const resetUrl = `${hubUrl}/auth/reset-password?email=${encodeURIComponent(issued.email)}&token=${issued.token}`;

      await sendPasswordResetEmail({ to: issued.email, resetUrl });
    }

    return NextResponse.json({ data: { message: GENERIC_MESSAGE, mode: "database" } });
  } catch (err) {
    console.error("[forgot-password] failed:", err);
    return NextResponse.json({ error: "Unable to process password reset request." }, { status: 500 });
  }
}
