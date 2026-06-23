import type { PublicPlatformConfig } from "@fosl/contracts";
import { getPublicPlatformConfigFromDb } from "./platform-settings";

export async function resolvePublicPlatformConfig(
  fallback: () => PublicPlatformConfig
): Promise<{ data: PublicPlatformConfig; source: "database" | "mock" }> {
  if (process.env.DATABASE_URL) {
    try {
      const data = await getPublicPlatformConfigFromDb();
      if (data) return { data, source: "database" };
    } catch (err) {
      console.error("[platform-config] db read failed:", err);
    }
  }
  return { data: fallback(), source: "mock" };
}
