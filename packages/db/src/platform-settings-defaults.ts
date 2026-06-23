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
