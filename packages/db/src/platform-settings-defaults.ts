import type { PlatformSettings } from "@fosl/contracts";
import { FOSL_DEPLOY_BRANCH } from "@fosl/contracts";

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
    admin: "http://localhost:3000/admin",
  },
  auth: {
    enabled: false,
    authUrl: "http://localhost:3000",
    secretConfigured: false,
  },
  apiMocking: {
    enabled: false,
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
    branch: FOSL_DEPLOY_BRANCH,
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
