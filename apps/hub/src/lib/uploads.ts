import path from "node:path";

/** Resolve local upload directory (repo-root `uploads/` by default for Hub). */
export function getUploadDir(): string {
  const configured = process.env.UPLOAD_DIR?.trim();
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.resolve(process.cwd(), configured);
  }
  return path.resolve(process.cwd(), "../../uploads");
}
