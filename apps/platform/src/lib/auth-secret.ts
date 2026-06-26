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

/** Hosted hub domains always require auth when AUTH_SECRET is configured. */
export function isHostedProductionHub(hostname?: string) {
  const hubUrl =
    process.env.AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_HUB_URL?.trim() ||
    "";
  if (hubUrl.includes("foslone.com")) return true;
  if (hostname?.endsWith(".foslone.com") || hostname === "foslone.com") return true;
  return false;
}

export function isAuthEnabled(hostname?: string): boolean {
  const secret = getAuthSecret();
  if (isHostedProductionHub(hostname) && secret) return true;

  const flag = process.env.AUTH_ENABLED?.trim().toLowerCase();
  if (flag === "true" || flag === "1" || flag === "on") return true;
  if (flag === "false" || flag === "0" || flag === "off") {
    // Production deploys always protect routes when AUTH_SECRET is configured.
    if (process.env.NODE_ENV === "production" && secret) return true;
    return false;
  }

  if (!secret) return false;
  if (process.env.NODE_ENV === "production") return true;
  return true;
}
