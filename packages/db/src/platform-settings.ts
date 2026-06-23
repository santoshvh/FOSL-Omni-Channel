import type { PlatformSettings } from "@fosl/contracts";
import { prisma } from "./client";
import { defaultPlatformSettings } from "./platform-settings-defaults";

type StoredSecrets = {
  postmarkServerToken?: string;
  resendApiKey?: string;
  s3AccessKey?: string;
  s3SecretKey?: string;
  autoDeployWebhookSecret?: string;
};

type StoredSettings = PlatformSettings & { secrets?: StoredSecrets };

function envConfigured(value: string | undefined) {
  return Boolean(value?.trim());
}

function applyEnvOverrides(settings: PlatformSettings): PlatformSettings {
  return {
    ...settings,
    fileStorage: {
      ...settings.fileStorage,
      localUploadDir: process.env.UPLOAD_DIR?.trim() || settings.fileStorage.localUploadDir,
    },
    email: {
      ...settings.email,
      postmarkServerTokenConfigured:
        settings.email.postmarkServerTokenConfigured ||
        envConfigured(process.env.POSTMARK_SERVER_TOKEN),
      resendApiKeyConfigured:
        settings.email.resendApiKeyConfigured || envConfigured(process.env.RESEND_API_KEY),
    },
    stripe: {
      ...settings.stripe,
      secretKeyConfigured:
        settings.stripe.secretKeyConfigured || envConfigured(process.env.STRIPE_SECRET_KEY),
      publishableKeyConfigured:
        settings.stripe.publishableKeyConfigured ||
        envConfigured(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      webhookConfigured:
        settings.stripe.webhookConfigured || envConfigured(process.env.STRIPE_WEBHOOK_SECRET),
    },
  };
}

function stripSecrets(stored: StoredSettings): PlatformSettings {
  const { secrets: _secrets, ...publicSettings } = stored;
  return applyEnvOverrides(publicSettings);
}

function mergeDefaults(stored: Partial<StoredSettings> | null): StoredSettings {
  return {
    ...defaultPlatformSettings,
    ...stored,
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
  if (!row) return applyEnvOverrides(defaultPlatformSettings);
  return stripSecrets(mergeDefaults(row.settings as unknown as StoredSettings));
}

export type SettingsPatch = {
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
  stripe?: Partial<PlatformSettings["stripe"]>;
};

export async function updatePlatformSettingsInDb(patch: SettingsPatch): Promise<PlatformSettings> {
  const existingRow = await prisma.platformConfig.findUnique({ where: { id: "default" } });
  const current = mergeDefaults((existingRow?.settings as unknown as StoredSettings | undefined) ?? null);
  const secrets: StoredSecrets = { ...current.secrets };

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

  if (patch.featureFlags) {
    current.featureFlags = { ...current.featureFlags, ...patch.featureFlags };
  }
  if (patch.autoDeploy) {
    const { webhookSecret: _ws, ...autoDeployPatch } = patch.autoDeploy;
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
    current.stripe = { ...current.stripe, ...patch.stripe };
  }

  current.updatedAt = new Date().toISOString();
  current.secrets = secrets;

  await prisma.platformConfig.upsert({
    where: { id: "default" },
    create: { id: "default", settings: current as object },
    update: { settings: current as object },
  });

  return stripSecrets(current);
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
