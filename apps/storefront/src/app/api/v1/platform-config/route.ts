import { NextResponse } from "next/server";
import { getMockPublicPlatformConfig } from "@fosl/mocks";
import { resolvePublicPlatformConfig } from "@fosl/db";

export async function GET() {
  try {
    const result = await resolvePublicPlatformConfig(getMockPublicPlatformConfig);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[platform-config] GET failed:", err);
    return NextResponse.json({ error: "Unable to load platform config." }, { status: 500 });
  }
}
