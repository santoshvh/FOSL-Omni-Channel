/** Resolves Auth.js secret — loaded from `.fosl-runtime.json` after Admin save. */
export function getAuthSecret(): string | undefined {
  const fromEnv = process.env.AUTH_SECRET?.trim();
  if (fromEnv && fromEnv !== "generate-with-openssl-rand-base64-32") {
    return fromEnv;
  }
  if (process.env.NODE_ENV === "development") {
    return "fosl-dev-auth-secret-change-before-production";
  }
  return undefined;
}

export function isAuthEnabled(): boolean {
  const flag = process.env.AUTH_ENABLED?.trim().toLowerCase();
  if (flag === "false" || flag === "0" || flag === "off") return false;
  if (flag === "true" || flag === "1" || flag === "on") {
    return Boolean(getAuthSecret());
  }
  return Boolean(getAuthSecret());
}
