import { NextResponse } from "next/server";
import { defaultPlatformSettings, resolvePublicPlatformConfig } from "@fosl/db";

export async function GET() {
  try {
    const result = await resolvePublicPlatformConfig();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[platform-config] GET failed:", err);
    const settings = defaultPlatformSettings;
    return NextResponse.json({
      data: {
        appUrls: settings.appUrls,
        auth: { enabled: settings.auth.enabled, authUrl: settings.auth.authUrl },
        apiMocking: settings.apiMocking,
        storefront: settings.storefront,
        featureFlags: settings.featureFlags,
        stripePublishableKey: null,
        emailProvider: settings.email.provider,
      },
      source: "defaults",
    });
  }
}
