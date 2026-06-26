import { createHash, randomBytes } from "crypto";
import { prisma } from "./client";

export type ResolvedStorefront = {
  id: string;
  path: string;
  name: string;
  customDomain: string | null;
  isDefault: boolean;
  publishableKey: string | null;
  allowedOrigins: unknown;
  operatorId: string;
  operator: {
    id: string;
    name: string;
    slug: string;
    stripeConnectId: string | null;
  };
};

export type StorefrontResolveInput = {
  publishableKey?: string | null;
  host?: string | null;
  storefrontPath?: string | null;
};

function normalizeHost(host: string) {
  return host.toLowerCase().split(":")[0]!.trim();
}

export function hashStorefrontSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function generateStorefrontKeyPair() {
  const publishableKey = `pk_sf_${randomBytes(16).toString("hex")}`;
  const secretKey = `sk_sf_${randomBytes(24).toString("hex")}`;
  return { publishableKey, secretKey, secretKeyHash: hashStorefrontSecret(secretKey) };
}

export async function getStorefrontByPublishableKey(publishableKey: string) {
  return prisma.storefront.findUnique({
    where: { publishableKey },
    include: {
      operator: {
        select: { id: true, name: true, slug: true, stripeConnectId: true },
      },
    },
  });
}

export async function getStorefrontByCustomDomain(host: string) {
  const normalized = normalizeHost(host);
  return prisma.storefront.findUnique({
    where: { customDomain: normalized },
    include: {
      operator: {
        select: { id: true, name: true, slug: true, stripeConnectId: true },
      },
    },
  });
}

export async function resolveStorefront(
  input: StorefrontResolveInput
): Promise<ResolvedStorefront | null> {
  const key = input.publishableKey?.trim();
  if (key) {
    const byKey = await getStorefrontByPublishableKey(key);
    if (byKey) return byKey;
  }

  const host = input.host?.trim();
  if (host) {
    const byDomain = await getStorefrontByCustomDomain(host);
    if (byDomain) return byDomain;
  }

  const path = input.storefrontPath?.trim();
  if (path) {
    const byPath = await prisma.storefront.findUnique({
      where: { path },
      include: {
        operator: {
          select: { id: true, name: true, slug: true, stripeConnectId: true },
        },
      },
    });
    if (byPath) return byPath;
  }

  return null;
}

export function parsePublishableKeyFromAuthHeader(header: string | null) {
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token.startsWith("pk_sf_") ? token : null;
}

export function storefrontAllowedOrigins(storefront: { allowedOrigins: unknown }): string[] {
  if (!Array.isArray(storefront.allowedOrigins)) return [];
  return storefront.allowedOrigins.filter((v): v is string => typeof v === "string");
}

export async function listOperatorStorefronts(operatorId: string) {
  return prisma.storefront.findMany({
    where: { operatorId },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    include: {
      operator: {
        select: { id: true, name: true, slug: true, stripeConnectId: true },
      },
    },
  });
}

export async function createOperatorStorefront(params: {
  operatorId: string;
  name: string;
  path: string;
  customDomain?: string | null;
  isDefault?: boolean;
}) {
  const keys = generateStorefrontKeyPair();
  return prisma.storefront.create({
    data: {
      operatorId: params.operatorId,
      name: params.name,
      path: params.path,
      customDomain: params.customDomain?.trim() || null,
      isDefault: params.isDefault ?? false,
      publishableKey: keys.publishableKey,
      secretKeyHash: keys.secretKeyHash,
      allowedOrigins: [],
    },
    include: {
      operator: {
        select: { id: true, name: true, slug: true, stripeConnectId: true },
      },
    },
    // Return secret once at creation — caller must surface to operator
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }).then((storefront) => ({ storefront, secretKey: keys.secretKey }));
}

export async function rotateStorefrontSecretKey(storefrontId: string, operatorId: string) {
  const existing = await prisma.storefront.findFirst({
    where: { id: storefrontId, operatorId },
  });
  if (!existing) return null;

  const keys = generateStorefrontKeyPair();
  const storefront = await prisma.storefront.update({
    where: { id: storefrontId },
    data: {
      publishableKey: keys.publishableKey,
      secretKeyHash: keys.secretKeyHash,
    },
    include: {
      operator: {
        select: { id: true, name: true, slug: true, stripeConnectId: true },
      },
    },
  });

  return { storefront, secretKey: keys.secretKey };
}

export async function updateStorefrontSettings(
  storefrontId: string,
  operatorId: string,
  patch: { name?: string; customDomain?: string | null; allowedOrigins?: string[] }
) {
  return prisma.storefront.updateMany({
    where: { id: storefrontId, operatorId },
    data: {
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.customDomain !== undefined ? { customDomain: patch.customDomain } : {}),
      ...(patch.allowedOrigins !== undefined ? { allowedOrigins: patch.allowedOrigins } : {}),
    },
  });
}
