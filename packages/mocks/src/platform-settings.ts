import type { PlatformSettings } from "@fosl/contracts";

export const defaultPlatformSettings: PlatformSettings = {
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

export function getMockPlatformSettings(): PlatformSettings {
  return structuredClone(mockSettings);
}

export function updateMockPlatformSettings(patch: Record<string, unknown>): PlatformSettings {
  mockSettings = deepMerge(
    mockSettings as unknown as Record<string, unknown>,
    patch
  ) as unknown as PlatformSettings;

  const emailPatch = patch.email as Record<string, unknown> | undefined;
  if (emailPatch?.postmarkServerToken) {
    mockSettings.email.postmarkServerTokenConfigured = true;
  }
  if (emailPatch?.resendApiKey) {
    mockSettings.email.resendApiKeyConfigured = true;
  }

  const filePatch = patch.fileStorage as Record<string, unknown> | undefined;
  if (filePatch?.s3AccessKey) mockSettings.fileStorage.s3AccessKeyConfigured = true;
  if (filePatch?.s3SecretKey) mockSettings.fileStorage.s3SecretConfigured = true;

  mockSettings.updatedAt = new Date().toISOString();
  return getMockPlatformSettings();
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
