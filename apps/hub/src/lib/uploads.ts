import path from "node:path";
import { getPlatformSettingsFromDb } from "@fosl/db";

/** Resolve local upload directory from platform settings or env fallback. */
export async function getUploadDir(): Promise<string> {
  if (process.env.DATABASE_URL) {
    try {
      const settings = await getPlatformSettingsFromDb();
      if (settings?.fileStorage.provider === "local" && settings.fileStorage.localUploadDir) {
        const configured = settings.fileStorage.localUploadDir;
        return path.isAbsolute(configured)
          ? configured
          : path.resolve(process.cwd(), configured);
      }
    } catch (err) {
      console.error("[uploads] settings read failed:", err);
    }
  }

  const configured = process.env.UPLOAD_DIR?.trim();
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.resolve(process.cwd(), configured);
  }
  return path.resolve(process.cwd(), "../../uploads");
}
