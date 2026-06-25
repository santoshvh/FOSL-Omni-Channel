import { NextResponse } from "next/server";
import { runPlatformDeploy } from "@/lib/platform-settings-service";

export async function POST() {
  try {
    const result = await runPlatformDeploy();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[settings/deploy] failed:", err);
    return NextResponse.json({ error: "Deploy failed." }, { status: 500 });
  }
}
