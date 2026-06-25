import { writeFileSync } from "node:fs";
import path from "node:path";
import type { PlatformSettings } from "@fosl/contracts";

export type PlatformSecrets = {
  databasePassword?: string;
  authSecret?: string;
  postmarkServerToken?: string;
  resendApiKey?: string;
  s3AccessKey?: string;
  s3SecretKey?: string;
  stripeSecretKey?: string;
  stripePublishableKey?: string;
  stripeWebhookSecret?: string;
  payoutJobSecret?: string;
  autoDeployWebhookSecret?: string;
};

export function buildDatabaseUrl(
  database: PlatformSettings["database"],
  password?: string
): string | null {
  if (!password?.trim()) return null;
  const encodedUser = encodeURIComponent(database.username);
  const encodedPass = encodeURIComponent(password);
  return `mysql://${encodedUser}:${encodedPass}@${database.host}:${database.port}/${database.database}`;
}

export function buildRuntimeEnv(
  settings: PlatformSettings,
  secrets: PlatformSecrets
): Record<string, string> {
  const platformUrl = settings.appUrls.hub.replace(/\/$/, "");
  const adminUrl =
    settings.appUrls.admin?.trim() || `${platformUrl}/admin`;

  const env: Record<string, string> = {
    DATABASE_PROVIDER: settings.database.provider,
    NEXT_PUBLIC_HUB_URL: platformUrl,
    NEXT_PUBLIC_PLATFORM_URL: platformUrl,
    NEXT_PUBLIC_STOREFRONT_URL: settings.appUrls.storefront,
    NEXT_PUBLIC_ADMIN_URL: adminUrl,
    AUTH_URL: settings.auth.authUrl,
    AUTH_ENABLED: settings.auth.enabled ? "true" : "false",
    NEXT_PUBLIC_STOREFRONT_SUBSCRIPTION_STATE: settings.storefront.subscriptionState,
    NEXT_PUBLIC_API_MOCKING: settings.apiMocking.enabled ? "true" : "false",
    UPLOAD_DIR: settings.fileStorage.localUploadDir,
    FILE_STORAGE_PROVIDER: settings.fileStorage.provider,
    EMAIL_FROM: settings.email.fromAddress,
  };

  if (settings.fileStorage.provider === "s3") {
    env.S3_BUCKET = settings.fileStorage.s3Bucket;
    env.S3_REGION = settings.fileStorage.s3Region;
    if (settings.fileStorage.s3PublicUrlPrefix) {
      env.S3_PUBLIC_URL_PREFIX = settings.fileStorage.s3PublicUrlPrefix;
    }
    if (secrets.s3AccessKey) env.AWS_ACCESS_KEY_ID = secrets.s3AccessKey;
    if (secrets.s3SecretKey) env.AWS_SECRET_ACCESS_KEY = secrets.s3SecretKey;
  }

  const databaseUrl = buildDatabaseUrl(settings.database, secrets.databasePassword);
  if (databaseUrl) env.DATABASE_URL = databaseUrl;
  if (secrets.authSecret) env.AUTH_SECRET = secrets.authSecret;
  if (secrets.stripeSecretKey) env.STRIPE_SECRET_KEY = secrets.stripeSecretKey;
  if (secrets.stripePublishableKey) {
    env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = secrets.stripePublishableKey;
  }
  if (secrets.stripeWebhookSecret) env.STRIPE_WEBHOOK_SECRET = secrets.stripeWebhookSecret;
  if (secrets.postmarkServerToken) env.POSTMARK_SERVER_TOKEN = secrets.postmarkServerToken;
  if (secrets.resendApiKey) env.RESEND_API_KEY = secrets.resendApiKey;
  if (secrets.payoutJobSecret) env.PAYOUT_JOB_SECRET = secrets.payoutJobSecret;

  return env;
}

export function writeRuntimeConfigFile(repoRoot: string, env: Record<string, string>) {
  const target = path.join(repoRoot, ".fosl-runtime.json");
  writeFileSync(target, JSON.stringify(env, null, 2), "utf8");
}
