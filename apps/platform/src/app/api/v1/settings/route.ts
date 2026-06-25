import { NextResponse } from "next/server";
import { platformSettingsPatchSchema } from "@fosl/contracts";
import { requireAdmin } from "@/lib/api-auth";
import { fetchPlatformSettings, savePlatformSettings } from "@/lib/platform-settings-service";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const result = await fetchPlatformSettings();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[settings] GET failed:", err);
    return NextResponse.json({ error: "Unable to load settings." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = platformSettingsPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid settings payload." }, { status: 400 });
  }

  try {
    const result = await savePlatformSettings(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[settings] PATCH failed:", err);
    return NextResponse.json({ error: "Unable to save settings." }, { status: 500 });
  }
}
