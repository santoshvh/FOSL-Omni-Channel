import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { FileStorageProvider, PlatformSettings } from "@fosl/contracts";
import { getMockPlatformSecrets, getMockPlatformSettings } from "@fosl/mocks";
import { getPlatformSecretsFromDb, getPlatformSettingsFromDb } from "./platform-settings";
import type { PlatformSecrets } from "./runtime-config";

type ResolvedStorage = {
  provider: FileStorageProvider;
  settings: PlatformSettings;
  secrets: PlatformSecrets;
};

async function resolveStorage(): Promise<ResolvedStorage> {
  if (process.env.DATABASE_URL) {
    try {
      const settings = await getPlatformSettingsFromDb();
      const secrets = await getPlatformSecretsFromDb();
      if (settings) {
        return { provider: settings.fileStorage.provider, settings, secrets };
      }
    } catch (err) {
      console.error("[file-storage] settings read failed:", err);
    }
  }

  const settings = getMockPlatformSettings();
  return {
    provider: settings.fileStorage.provider,
    settings,
    secrets: getMockPlatformSecrets(),
  };
}

function resolveLocalUploadDir(settings: PlatformSettings): string {
  const configured =
    settings.fileStorage.localUploadDir?.trim() || process.env.UPLOAD_DIR?.trim();
  if (!configured) return path.resolve(process.cwd(), "../../uploads");
  return path.isAbsolute(configured)
    ? configured
    : path.resolve(process.cwd(), configured);
}

function buildS3PublicUrl(settings: PlatformSettings, key: string): string {
  const prefix = settings.fileStorage.s3PublicUrlPrefix.trim().replace(/\/$/, "");
  if (prefix) return `${prefix}/${key}`;
  const bucket = settings.fileStorage.s3Bucket;
  const region = settings.fileStorage.s3Region;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

function getS3Credentials(settings: PlatformSettings, secrets: PlatformSecrets) {
  const accessKeyId = secrets.s3AccessKey?.trim() || process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey =
    secrets.s3SecretKey?.trim() || process.env.AWS_SECRET_ACCESS_KEY?.trim();
  return { accessKeyId, secretAccessKey };
}

function assertS3Configured(settings: PlatformSettings, secrets: PlatformSecrets) {
  if (!settings.fileStorage.s3Bucket?.trim()) {
    throw new Error("S3 bucket is not configured in Admin Settings.");
  }
  if (!settings.fileStorage.s3Region?.trim()) {
    throw new Error("S3 region is not configured in Admin Settings.");
  }
  const { accessKeyId, secretAccessKey } = getS3Credentials(settings, secrets);
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("S3 access key and secret are not configured in Admin Settings.");
  }
}

function createS3Client(settings: PlatformSettings, secrets: PlatformSecrets) {
  const { accessKeyId, secretAccessKey } = getS3Credentials(settings, secrets);
  return new S3Client({
    region: settings.fileStorage.s3Region,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  });
}

export type PlatformFileUpload = {
  buffer: Buffer;
  contentType: string;
  originalName: string;
};

export type PlatformFileUploadResult = {
  url: string;
  filename: string;
  provider: FileStorageProvider;
};

export async function uploadPlatformFile(
  input: PlatformFileUpload,
  hubBaseUrl: string
): Promise<PlatformFileUploadResult> {
  const { provider, settings, secrets } = await resolveStorage();
  const ext = input.originalName.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${randomUUID()}.${ext}`;

  if (provider === "s3") {
    assertS3Configured(settings, secrets);
    const key = `uploads/${filename}`;
    const client = createS3Client(settings, secrets);
    await client.send(
      new PutObjectCommand({
        Bucket: settings.fileStorage.s3Bucket,
        Key: key,
        Body: input.buffer,
        ContentType: input.contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    return {
      url: buildS3PublicUrl(settings, key),
      filename,
      provider: "s3",
    };
  }

  const uploadDir = resolveLocalUploadDir(settings);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), input.buffer);

  const baseUrl = hubBaseUrl.replace(/\/$/, "");
  return {
    url: `${baseUrl}/api/v1/uploads/${filename}`,
    filename,
    provider: "local",
  };
}

export async function readLocalPlatformFile(filename: string): Promise<Buffer | null> {
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    throw new Error("Invalid filename.");
  }

  const { settings } = await resolveStorage();
  try {
    const uploadDir = resolveLocalUploadDir(settings);
    return await readFile(path.join(uploadDir, filename));
  } catch {
    return null;
  }
}

export async function getFileStorageProvider(): Promise<FileStorageProvider> {
  const { provider } = await resolveStorage();
  return provider;
}
