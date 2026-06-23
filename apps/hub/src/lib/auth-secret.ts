/** Resolves Auth.js secret — root `.env` may not reach Edge middleware without next.config `env`. */
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
  return Boolean(getAuthSecret());
}
