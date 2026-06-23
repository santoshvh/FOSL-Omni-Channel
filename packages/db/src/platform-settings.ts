import type { PlatformSettings, PublicPlatformConfig } from "@fosl/contracts";
import { prisma } from "./client";
import { defaultPlatformSettings } from "./platform-settings-defaults";
import type { PlatformSecrets } from "./runtime-config";

type StoredSecrets = PlatformSecrets;

type StoredSettings = PlatformSettings & { secrets?: StoredSecrets };

function stripSecrets(stored: StoredSettings): PlatformSettings {
  const { secrets: _secrets, ...publicSettings } = stored;
  return publicSettings;
}

function mergeDefaults(stored: Partial<StoredSettings> | null): StoredSettings {
  return {
    ...defaultPlatformSettings,
    ...stored,
    database: { ...defaultPlatformSettings.database, ...stored?.database },
    appUrls: { ...defaultPlatformSettings.appUrls, ...stored?.appUrls },
    auth: { ...defaultPlatformSettings.auth, ...stored?.auth },
    apiMocking: { ...defaultPlatformSettings.apiMocking, ...stored?.apiMocking },
    storefront: { ...defaultPlatformSettings.storefront, ...stored?.storefront },
    jobs: { ...defaultPlatformSettings.jobs, ...stored?.jobs },
    featureFlags: { ...defaultPlatformSettings.featureFlags, ...stored?.featureFlags },
    autoDeploy: { ...defaultPlatformSettings.autoDeploy, ...stored?.autoDeploy },
    fileStorage: { ...defaultPlatformSettings.fileStorage, ...stored?.fileStorage },
    email: { ...defaultPlatformSettings.email, ...stored?.email },
    stripe: { ...defaultPlatformSettings.stripe, ...stored?.stripe },
    secrets: stored?.secrets ?? {},
  };
}

export async function getPlatformSettingsFromDb(): Promise<PlatformSettings | null> {
  if (!process.env.DATABASE_URL) return null;
  const row = await prisma.platformConfig.findUnique({ where: { id: "default" } });
  if (!row) return defaultPlatformSettings;
  return stripSecrets(mergeDefaults(row.settings as unknown as StoredSettings));
}

export async function getPlatformSecretsFromDb(): Promise<PlatformSecrets> {
  if (!process.env.DATABASE_URL) return {};
  const row = await prisma.platformConfig.findUnique({ where: { id: "default" } });
  if (!row) return {};
  const stored = row.settings as unknown as StoredSettings;
  return stored.secrets ?? {};
}

export async function getPublicPlatformConfigFromDb(): Promise<PublicPlatformConfig | null> {
  if (!process.env.DATABASE_URL) return null;
  const settings = await getPlatformSettingsFromDb();
  const secrets = await getPlatformSecretsFromDb();
  if (!settings) return null;
  return {
    appUrls: settings.appUrls,
    auth: { enabled: settings.auth.enabled, authUrl: settings.auth.authUrl },
    apiMocking: settings.apiMocking,
    storefront: settings.storefront,
    featureFlags: settings.featureFlags,
    stripePublishableKey: secrets.stripePublishableKey ?? null,
    emailProvider: settings.email.provider,
  };
}

export type SettingsPatch = {
  database?: Partial<PlatformSettings["database"]> & { password?: string };
  appUrls?: Partial<PlatformSettings["appUrls"]>;
  auth?: Partial<PlatformSettings["auth"]> & { authSecret?: string };
  apiMocking?: Partial<PlatformSettings["apiMocking"]>;
  storefront?: Partial<PlatformSettings["storefront"]>;
  jobs?: Partial<PlatformSettings["jobs"]> & { payoutJobSecret?: string };
  featureFlags?: Partial<PlatformSettings["featureFlags"]>;
  autoDeploy?: Partial<PlatformSettings["autoDeploy"]> & { webhookSecret?: string };
  fileStorage?: Partial<PlatformSettings["fileStorage"]> & {
    s3AccessKey?: string;
    s3SecretKey?: string;
  };
  email?: Partial<PlatformSettings["email"]> & {
    postmarkServerToken?: string;
    resendApiKey?: string;
  };
  stripe?: Partial<PlatformSettings["stripe"]> & {
    secretKey?: string;
    publishableKey?: string;
    webhookSecret?: string;
  };
};

export async function updatePlatformSettingsInDb(patch: SettingsPatch): Promise<{
  settings: PlatformSettings;
  secrets: PlatformSecrets;
}> {
  const existingRow = await prisma.platformConfig.findUnique({ where: { id: "default" } });
  const current = mergeDefaults((existingRow?.settings as unknown as StoredSettings | undefined) ?? null);
  const secrets: StoredSecrets = { ...current.secrets };

  if (patch.database?.password?.trim()) {
    secrets.databasePassword = patch.database.password.trim();
    current.database.passwordConfigured = true;
  }
  if (patch.auth?.authSecret?.trim()) {
    secrets.authSecret = patch.auth.authSecret.trim();
    current.auth.secretConfigured = true;
  }
  if (patch.jobs?.payoutJobSecret?.trim()) {
    secrets.payoutJobSecret = patch.jobs.payoutJobSecret.trim();
    current.jobs.payoutJobSecretConfigured = true;
  }
  if (patch.autoDeploy?.webhookSecret?.trim()) {
    secrets.autoDeployWebhookSecret = patch.autoDeploy.webhookSecret.trim();
  }
  if (patch.email?.postmarkServerToken?.trim()) {
    secrets.postmarkServerToken = patch.email.postmarkServerToken.trim();
    current.email.postmarkServerTokenConfigured = true;
  }
  if (patch.email?.resendApiKey?.trim()) {
    secrets.resendApiKey = patch.email.resendApiKey.trim();
    current.email.resendApiKeyConfigured = true;
  }
  if (patch.fileStorage?.s3AccessKey?.trim()) {
    secrets.s3AccessKey = patch.fileStorage.s3AccessKey.trim();
    current.fileStorage.s3AccessKeyConfigured = true;
  }
  if (patch.fileStorage?.s3SecretKey?.trim()) {
    secrets.s3SecretKey = patch.fileStorage.s3SecretKey.trim();
    current.fileStorage.s3SecretConfigured = true;
  }
  if (patch.stripe?.secretKey?.trim()) {
    secrets.stripeSecretKey = patch.stripe.secretKey.trim();
    current.stripe.secretKeyConfigured = true;
  }
  if (patch.stripe?.publishableKey?.trim()) {
    secrets.stripePublishableKey = patch.stripe.publishableKey.trim();
    current.stripe.publishableKeyConfigured = true;
  }
  if (patch.stripe?.webhookSecret?.trim()) {
    secrets.stripeWebhookSecret = patch.stripe.webhookSecret.trim();
    current.stripe.webhookConfigured = true;
  }

  if (patch.database) {
    const { password: _p, ...dbPatch } = patch.database;
    current.database = { ...current.database, ...dbPatch };
  }
  if (patch.appUrls) current.appUrls = { ...current.appUrls, ...patch.appUrls };
  if (patch.auth) {
    const { authSecret: _s, ...authPatch } = patch.auth;
    current.auth = { ...current.auth, ...authPatch };
  }
  if (patch.apiMocking) current.apiMocking = { ...current.apiMocking, ...patch.apiMocking };
  if (patch.storefront) current.storefront = { ...current.storefront, ...patch.storefront };
  if (patch.jobs) {
    const { payoutJobSecret: _p, ...jobsPatch } = patch.jobs;
    current.jobs = { ...current.jobs, ...jobsPatch };
  }
  if (patch.featureFlags) current.featureFlags = { ...current.featureFlags, ...patch.featureFlags };
  if (patch.autoDeploy) {
    const { webhookSecret: _w, ...autoDeployPatch } = patch.autoDeploy;
    current.autoDeploy = { ...current.autoDeploy, ...autoDeployPatch };
  }
  if (patch.fileStorage) {
    const { s3AccessKey: _a, s3SecretKey: _s, ...filePatch } = patch.fileStorage;
    current.fileStorage = { ...current.fileStorage, ...filePatch };
  }
  if (patch.email) {
    const { postmarkServerToken: _p, resendApiKey: _r, ...emailPatch } = patch.email;
    current.email = { ...current.email, ...emailPatch };
  }
  if (patch.stripe) {
    const { secretKey: _sk, publishableKey: _pk, webhookSecret: _wh, ...stripePatch } = patch.stripe;
    current.stripe = { ...current.stripe, ...stripePatch };
  }

  current.updatedAt = new Date().toISOString();
  current.secrets = secrets;

  await prisma.platformConfig.upsert({
    where: { id: "default" },
    create: { id: "default", settings: current as object },
    update: { settings: current as object },
  });

  return { settings: stripSecrets(current), secrets };
}

export async function recordDeployInDb(message: string, status: "pending" | "success" | "failed") {
  const existingRow = await prisma.platformConfig.findUnique({ where: { id: "default" } });
  const current = mergeDefaults((existingRow?.settings as unknown as StoredSettings | undefined) ?? null);
  current.autoDeploy = {
    ...current.autoDeploy,
    lastDeployAt: new Date().toISOString(),
    lastDeployStatus: status,
    lastDeployMessage: message,
  };
  current.updatedAt = new Date().toISOString();

  await prisma.platformConfig.upsert({
    where: { id: "default" },
    create: { id: "default", settings: current as object },
    update: { settings: current as object },
  });

  return stripSecrets(current);
}
