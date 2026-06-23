import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@fosl/contracts";
import { resetPasswordWithToken } from "@fosl/db";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid reset payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { email, token, password } = parsed.data;

  if (!process.env.DATABASE_URL) {
    if (token !== "demo_reset_token") {
      return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
    }
    return NextResponse.json({
      data: { message: "Password updated (mock mode — set DATABASE_URL to persist).", mode: "mock" },
    });
  }

  try {
    const result = await resetPasswordWithToken(email, token, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      data: { message: "Password updated. You can sign in with your new password.", mode: "database" },
    });
  } catch (err) {
    console.error("[reset-password] failed:", err);
    return NextResponse.json({ error: "Unable to reset password." }, { status: 500 });
  }
}
