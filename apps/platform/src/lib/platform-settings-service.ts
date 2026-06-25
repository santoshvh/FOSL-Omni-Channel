import path from "node:path";
import type { PlatformSettings } from "@fosl/contracts";
import {
  getMockPlatformSettings,
  getMockPlatformSecrets,
  triggerMockDeploy,
  updateMockPlatformSettings,
} from "@fosl/mocks";
import {
  buildRuntimeEnv,
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
      const { settings, secrets } = await updatePlatformSettingsInDb(patch);
      const runtimeEnv = buildRuntimeEnv(settings, secrets);
      writeRuntimeConfigFile(getRepoRoot(), runtimeEnv);
      return {
        data: settings,
        source: "database" as const,
        message:
          "Settings saved. Restart all dev servers (hub, storefront, admin) so `.fosl-runtime.json` is loaded.",
      };
    } catch (err) {
      console.error("[platform-settings] db write failed:", err);
    }
  }

  const data = updateMockPlatformSettings(patch as Record<string, unknown>);
  const mockSecrets = getMockPlatformSecrets();
  const runtimeEnv = buildRuntimeEnv(data, {
    databasePassword: mockSecrets.databasePassword,
    authSecret: mockSecrets.authSecret,
    postmarkServerToken: mockSecrets.postmarkServerToken,
    resendApiKey: mockSecrets.resendApiKey,
    s3AccessKey: mockSecrets.s3AccessKey,
    s3SecretKey: mockSecrets.s3SecretKey,
    stripeSecretKey: mockSecrets.stripeSecretKey,
    stripePublishableKey: mockSecrets.stripePublishableKey,
    stripeWebhookSecret: mockSecrets.stripeWebhookSecret,
    payoutJobSecret: mockSecrets.payoutJobSecret,
    autoDeployWebhookSecret: mockSecrets.autoDeployWebhookSecret,
  });
  writeRuntimeConfigFile(getRepoRoot(), runtimeEnv);
  return {
    data,
    source: "mock" as const,
    message:
      "Settings saved (mock). Restart all dev servers so `.fosl-runtime.json` is loaded.",
  };
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
