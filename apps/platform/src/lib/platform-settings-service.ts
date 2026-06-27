import path from "node:path";
import type { PlatformSettings } from "@fosl/contracts";
import {
  buildRuntimeEnv,
  defaultPlatformSettings,
  getPlatformSettingsFromDb,
  getPlatformSecretsFromDb,
  recordDeployInDb,
  updatePlatformSettingsInDb,
  writeRuntimeConfigFile,
  type SettingsPatch,
} from "@fosl/db";

function getRepoRoot() {
  return path.resolve(process.cwd(), "../..");
}

function requireDatabase() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("Database not configured.");
  }
}

export async function fetchPlatformSettings(): Promise<{
  data: PlatformSettings;
  source: "database" | "defaults";
}> {
  if (process.env.DATABASE_URL?.trim()) {
    try {
      const data = await getPlatformSettingsFromDb();
      if (data) return { data, source: "database" };
    } catch (err) {
      console.error("[platform-settings] db read failed:", err);
    }
  }

  return { data: defaultPlatformSettings, source: "defaults" };
}

export async function savePlatformSettings(patch: SettingsPatch) {
  requireDatabase();

  try {
    const { settings, secrets } = await updatePlatformSettingsInDb(patch);
    const runtimeEnv = buildRuntimeEnv(settings, secrets);
    writeRuntimeConfigFile(getRepoRoot(), runtimeEnv);
    return {
      data: settings,
      source: "database" as const,
      message:
        "Settings saved. Restart dev servers (platform + storefront) so `.fosl-runtime.json` is loaded.",
    };
  } catch (err) {
    console.error("[platform-settings] db write failed:", err);
    throw err;
  }
}

export async function runPlatformDeploy() {
  requireDatabase();

  const targets: string[] = [];
  const { data: settings } = await fetchPlatformSettings();
  if (settings.autoDeploy.deployHub || settings.autoDeploy.deployAdmin) {
    targets.push("platform");
  }
  if (settings.autoDeploy.deployStorefront) targets.push("storefront");

  const message = `Deploy queued for: ${targets.join(", ") || "no apps selected"}.`;

  try {
    const data = await recordDeployInDb(message, "success");
    return { data, source: "database" as const };
  } catch (err) {
    console.error("[platform-settings] deploy record failed:", err);
    throw err;
  }
}
