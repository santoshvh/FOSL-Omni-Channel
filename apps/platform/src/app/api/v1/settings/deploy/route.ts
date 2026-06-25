import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { runPlatformDeploy } from "@/lib/platform-settings-service";

export async function POST() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const result = await runPlatformDeploy();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[settings/deploy] failed:", err);
    return NextResponse.json({ error: "Deploy failed." }, { status: 500 });
  }
}
