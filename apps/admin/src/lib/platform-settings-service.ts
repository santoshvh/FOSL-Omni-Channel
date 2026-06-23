import type { PlatformSettings } from "@fosl/contracts";
import {
  getMockPlatformSettings,
  triggerMockDeploy,
  updateMockPlatformSettings,
} from "@fosl/mocks";
import {
  getPlatformSettingsFromDb,
  recordDeployInDb,
  updatePlatformSettingsInDb,
  type SettingsPatch,
} from "@fosl/db";

export async function fetchPlatformSettings(): Promise<{
  data: PlatformSettings;
  source: "database" | "mock";
}> {
  if (process.env.DATABASE_URL) {
    try {
      const data = await getPlatformSettingsFromDb();
      if (data) return { data, source: "database" };
    } catch (err) {
      console.error("[platform-settings] db read failed:", err);
    }
  }
  return { data: getMockPlatformSettings(), source: "mock" };
}

export async function savePlatformSettings(patch: SettingsPatch) {
  if (process.env.DATABASE_URL) {
    try {
      const data = await updatePlatformSettingsInDb(patch);
      return { data, source: "database" as const };
    } catch (err) {
      console.error("[platform-settings] db write failed:", err);
    }
  }
  const data = updateMockPlatformSettings(patch as Record<string, unknown>);
  return { data, source: "mock" as const };
}

export async function runPlatformDeploy() {
  const targets: string[] = [];
  const { data: settings } = await fetchPlatformSettings();
  if (settings.autoDeploy.deployHub) targets.push("hub");
  if (settings.autoDeploy.deployStorefront) targets.push("storefront");
  if (settings.autoDeploy.deployAdmin) targets.push("admin");

  const message = `Deploy queued for: ${targets.join(", ") || "no apps selected"}.`;

  if (process.env.DATABASE_URL) {
    try {
      const data = await recordDeployInDb(message, "success");
      return { data, source: "database" as const };
    } catch (err) {
      console.error("[platform-settings] deploy record failed:", err);
    }
  }

  const data = triggerMockDeploy();
  return { data, source: "mock" as const };
}
