import type { PlatformSettings, PublicPlatformConfig } from "@fosl/contracts";

export const defaultPlatformSettings: PlatformSettings = {
  database: {
    provider: "mysql",
    host: "localhost",
    port: 3306,
    database: "fosl_dev",
    username: "fosl",
    passwordConfigured: false,
  },
  appUrls: {
    hub: "http://localhost:3000",
    storefront: "http://localhost:3001",
    admin: "http://localhost:3002",
  },
  auth: {
    enabled: false,
    authUrl: "http://localhost:3000",
    secretConfigured: false,
  },
  apiMocking: {
    enabled: true,
  },
  storefront: {
    subscriptionState: "active",
  },
  jobs: {
    payoutJobSecretConfigured: false,
  },
  featureFlags: {
    marketplace: true,
    referralTree: true,
    leadGen: true,
    bigcommerce: false,
  },
  autoDeploy: {
    enabled: false,
    branch: "master",
    githubRepo: "santoshvh/FOSL-Omni-Channel",
    webhookUrl: "",
    deployHub: true,
    deployStorefront: true,
    deployAdmin: true,
    lastDeployStatus: "idle",
  },
  fileStorage: {
    provider: "local",
    localUploadDir: "../../uploads",
    s3Bucket: "",
    s3Region: "us-east-1",
    s3PublicUrlPrefix: "",
    s3AccessKeyConfigured: false,
    s3SecretConfigured: false,
  },
  email: {
    provider: "console",
    fromAddress: "orders@foslone.com",
    postmarkServerTokenConfigured: false,
    resendApiKeyConfigured: false,
  },
  stripe: {
    connectEnabled: true,
    webhookConfigured: false,
    secretKeyConfigured: false,
    publishableKeyConfigured: false,
  },
};

let mockSettings: PlatformSettings = structuredClone(defaultPlatformSettings);
let mockSecrets: Record<string, string> = {};

export function getMockPlatformSettings(): PlatformSettings {
  return structuredClone(mockSettings);
}

export function getMockPlatformSecrets(): Record<string, string> {
  return { ...mockSecrets };
}

export function getMockPublicPlatformConfig(): PublicPlatformConfig {
  const settings = getMockPlatformSettings();
  const secrets = getMockPlatformSecrets();
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

export function updateMockPlatformSettings(patch: Record<string, unknown>): PlatformSettings {
  mockSettings = deepMerge(
    mockSettings as unknown as Record<string, unknown>,
    patch
  ) as unknown as PlatformSettings;

  applyMockSecrets(patch);
  mockSettings.updatedAt = new Date().toISOString();
  return getMockPlatformSettings();
}

function applyMockSecrets(patch: Record<string, unknown>) {
  const emailPatch = patch.email as Record<string, unknown> | undefined;
  if (emailPatch?.postmarkServerToken) {
    mockSecrets.postmarkServerToken = String(emailPatch.postmarkServerToken);
    mockSettings.email.postmarkServerTokenConfigured = true;
  }
  if (emailPatch?.resendApiKey) {
    mockSecrets.resendApiKey = String(emailPatch.resendApiKey);
    mockSettings.email.resendApiKeyConfigured = true;
  }
  const filePatch = patch.fileStorage as Record<string, unknown> | undefined;
  if (filePatch?.s3AccessKey) {
    mockSecrets.s3AccessKey = String(filePatch.s3AccessKey);
    mockSettings.fileStorage.s3AccessKeyConfigured = true;
  }
  if (filePatch?.s3SecretKey) {
    mockSecrets.s3SecretKey = String(filePatch.s3SecretKey);
    mockSettings.fileStorage.s3SecretConfigured = true;
  }
  const authPatch = patch.auth as Record<string, unknown> | undefined;
  if (authPatch?.authSecret) {
    mockSecrets.authSecret = String(authPatch.authSecret);
    mockSettings.auth.secretConfigured = true;
  }
  const stripePatch = patch.stripe as Record<string, unknown> | undefined;
  if (stripePatch?.secretKey) {
    mockSecrets.stripeSecretKey = String(stripePatch.secretKey);
    mockSettings.stripe.secretKeyConfigured = true;
  }
  if (stripePatch?.publishableKey) {
    mockSecrets.stripePublishableKey = String(stripePatch.publishableKey);
    mockSettings.stripe.publishableKeyConfigured = true;
  }
  if (stripePatch?.webhookSecret) {
    mockSecrets.stripeWebhookSecret = String(stripePatch.webhookSecret);
    mockSettings.stripe.webhookConfigured = true;
  }
  const dbPatch = patch.database as Record<string, unknown> | undefined;
  if (dbPatch?.password) {
    mockSecrets.databasePassword = String(dbPatch.password);
    mockSettings.database.passwordConfigured = true;
  }
  const jobsPatch = patch.jobs as Record<string, unknown> | undefined;
  if (jobsPatch?.payoutJobSecret) {
    mockSecrets.payoutJobSecret = String(jobsPatch.payoutJobSecret);
    mockSettings.jobs.payoutJobSecretConfigured = true;
  }
  const autoDeployPatch = patch.autoDeploy as Record<string, unknown> | undefined;
  if (autoDeployPatch?.webhookSecret) {
    mockSecrets.autoDeployWebhookSecret = String(autoDeployPatch.webhookSecret);
  }
}

export function triggerMockDeploy(): PlatformSettings {
  mockSettings.autoDeploy = {
    ...mockSettings.autoDeploy,
    lastDeployAt: new Date().toISOString(),
    lastDeployStatus: "success",
    lastDeployMessage: "Deploy queued for hub, storefront, and admin (mock).",
  };
  mockSettings.updatedAt = new Date().toISOString();
  return getMockPlatformSettings();
}

function deepMerge(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  const out = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    if (value && typeof value === "object" && !Array.isArray(value) && typeof out[key] === "object") {
      out[key] = deepMerge(out[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      out[key] = value;
    }
  }
  return out;
}
