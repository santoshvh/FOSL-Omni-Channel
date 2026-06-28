import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "fosl_customer_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 30;

export type CustomerSession = {
  userId: string;
  email: string;
  name: string;
};

type SignedPayload = CustomerSession & { exp: number };

function secret(): string {
  const key = process.env.AUTH_SECRET?.trim();
  if (!key || key === "generate-with-openssl-rand-base64-32") {
    throw new Error("AUTH_SECRET is required for customer sessions.");
  }
  return key;
}

function sign(payload: SignedPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token: string): SignedPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SignedPayload;
    if (!payload.userId || !payload.email || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createCustomerSessionToken(session: CustomerSession): string {
  return sign({ ...session, exp: Date.now() + MAX_AGE_SEC * 1000 });
}

export function parseCustomerSessionToken(token: string | undefined): CustomerSession | null {
  if (!token) return null;
  const payload = verify(token);
  if (!payload) return null;
  return { userId: payload.userId, email: payload.email, name: payload.name };
}

export function customerSessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}

export { COOKIE_NAME };
