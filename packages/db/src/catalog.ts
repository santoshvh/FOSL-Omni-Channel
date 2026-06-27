import type { Product } from "@fosl/contracts";
import type { ApprovalStatus } from "@prisma/client";
import { prisma } from "./client";
import { mapDbProduct } from "./mappers";

const approvedCatalogLink = {
  some: {
    status: "APPROVED" as const,
    scope: "CATALOG_WIDE" as const,
  },
};

const approvedLinkForOperator = (operatorId: string) => ({
  some: {
    operatorId,
    status: "APPROVED" as const,
    scope: "CATALOG_WIDE" as const,
  },
});

const productInclude = {
  vendor: { select: { id: true, name: true } },
} as const;

export async function resolveOperatorId(params: {
  operatorId?: string | null;
  storefrontPath?: string | null;
}): Promise<string | null> {
  if (params.operatorId?.trim()) return params.operatorId.trim();
  if (params.storefrontPath?.trim()) {
    const storefront = await prisma.storefront.findUnique({
      where: { path: params.storefrontPath.trim() },
      select: { operatorId: true },
    });
    return storefront?.operatorId ?? null;
  }
  return null;
}

export async function getDefaultOperatorId(): Promise<string | null> {
  const storefront = await prisma.storefront.findFirst({
    where: { isDefault: true },
    select: { operatorId: true },
  });
  return storefront?.operatorId ?? null;
}

export async function getOperatorForUserId(userId: string) {
  return prisma.operator.findFirst({
    where: { ownerUserId: userId },
    select: { id: true, name: true, slug: true },
  });
}

/** FOSL network marketplace — products from vendors with any approved operator link. */
export async function listNetworkProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      published: true,
      vendor: { operatorLinks: approvedCatalogLink },
    },
    include: productInclude,
    orderBy: { title: "asc" },
  });
  return rows.map(mapDbProduct);
}

/** Operator storefront — products inherited from approved shared vendors. */
export async function listOperatorProducts(operatorId: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      published: true,
      vendor: { operatorLinks: approvedLinkForOperator(operatorId) },
    },
    include: productInclude,
    orderBy: { title: "asc" },
  });
  return rows.map(mapDbProduct);
}

export async function getNetworkProduct(productId: string): Promise<Product | null> {
  const row = await prisma.product.findFirst({
    where: {
      id: productId,
      published: true,
      vendor: { operatorLinks: approvedCatalogLink },
    },
    include: productInclude,
  });
  return row ? mapDbProduct(row) : null;
}

export async function getOperatorProduct(
  operatorId: string,
  productId: string
): Promise<Product | null> {
  const row = await prisma.product.findFirst({
    where: {
      id: productId,
      published: true,
      vendor: { operatorLinks: approvedLinkForOperator(operatorId) },
    },
    include: productInclude,
  });
  return row ? mapDbProduct(row) : null;
}

export async function listVendorProducts(vendorId: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { vendorId },
    include: productInclude,
    orderBy: { title: "asc" },
  });
  return rows.map(mapDbProduct);
}

export async function getVendorProduct(
  vendorId: string,
  productId: string
): Promise<Product | null> {
  const row = await prisma.product.findFirst({
    where: { id: productId, vendorId },
    include: productInclude,
  });
  return row ? mapDbProduct(row) : null;
}

export async function createVendorProduct(
  vendorId: string,
  input: {
    sku: string;
    title: string;
    description: string;
    type: "physical" | "digital" | "lead_gen";
    priceCents: number;
    inventory?: number;
    category?: string;
    imageUrl?: string;
    published?: boolean;
  }
) {
  const row = await prisma.product.create({
    data: {
      vendorId,
      sku: input.sku,
      title: input.title,
      description: input.description,
      type: input.type.toUpperCase() as import("@prisma/client").ProductType,
      priceCents: input.priceCents,
      inventory: input.inventory ?? 0,
      category: input.category ?? "General",
      imageUrl: input.imageUrl ?? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      published: input.published ?? true,
      catalogSource: "NATIVE",
    },
    include: productInclude,
  });
  return mapDbProduct(row);
}

export async function updateVendorProduct(
  vendorId: string,
  productId: string,
  input: {
    title?: string;
    description?: string;
    priceCents?: number;
    inventory?: number;
    published?: boolean;
  }
) {
  const existing = await prisma.product.findFirst({ where: { id: productId, vendorId } });
  if (!existing) return null;

  const row = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(input.title != null ? { title: input.title } : {}),
      ...(input.description != null ? { description: input.description } : {}),
      ...(input.priceCents != null ? { priceCents: input.priceCents } : {}),
      ...(input.inventory != null ? { inventory: input.inventory } : {}),
      ...(input.published != null ? { published: input.published } : {}),
    },
    include: productInclude,
  });
  return mapDbProduct(row);
}

export async function areVendorsApprovedForOperator(
  operatorId: string,
  vendorIds: string[]
): Promise<boolean> {
  const unique = [...new Set(vendorIds)];
  if (unique.length === 0) return true;

  const approved = await prisma.operatorVendor.count({
    where: {
      operatorId,
      vendorId: { in: unique },
      status: "APPROVED",
    },
  });
  return approved === unique.length;
}

export async function listOperatorVendorLinks(operatorId: string) {
  return prisma.operatorVendor.findMany({
    where: { operatorId },
    include: {
      vendor: {
        include: {
          _count: { select: { products: { where: { published: true } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listVendorOperatorLinks(vendorId: string) {
  return prisma.operatorVendor.findMany({
    where: { vendorId },
    include: {
      operator: {
        select: {
          id: true,
          name: true,
          storefronts: { select: { id: true, name: true, path: true }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOperatorVendorLinkById(id: string) {
  return prisma.operatorVendor.findUnique({
    where: { id },
    include: {
      vendor: {
        include: {
          _count: { select: { products: { where: { published: true } } } },
        },
      },
      operator: { select: { id: true, name: true } },
    },
  });
}

export async function findVendorBySlug(slug: string) {
  return prisma.vendor.findUnique({
    where: { slug },
    include: {
      operatorLinks: {
        where: { status: "APPROVED" },
        include: { operator: { select: { id: true, name: true } } },
      },
      products: {
        where: { published: true },
        orderBy: { title: "asc" },
      },
    },
  });
}

export async function findVendorById(id: string) {
  return prisma.vendor.findUnique({
    where: { id },
    include: {
      operatorLinks: {
        where: { status: "APPROVED" },
        include: { operator: { select: { id: true, name: true } } },
      },
      products: {
        where: { published: true },
        orderBy: { title: "asc" },
      },
    },
  });
}

export async function inviteVendorToOperator(params: {
  operatorId: string;
  vendorId: string;
  minCommissionPct?: number;
  defaultCommissionPct?: number;
}) {
  return prisma.operatorVendor.upsert({
    where: {
      operatorId_vendorId: {
        operatorId: params.operatorId,
        vendorId: params.vendorId,
      },
    },
    update: {},
    create: {
      operatorId: params.operatorId,
      vendorId: params.vendorId,
      status: "PENDING",
      minCommissionPct: params.minCommissionPct ?? 8,
      defaultCommissionPct: params.defaultCommissionPct ?? 10,
    },
    include: { vendor: true },
  });
}

export async function updateOperatorVendorStatus(id: string, status: ApprovalStatus) {
  return prisma.operatorVendor.update({
    where: { id },
    data: { status },
    include: { vendor: true },
  });
}

export async function getStorefrontByPath(path: string) {
  return prisma.storefront.findUnique({
    where: { path },
    include: {
      operator: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function createCreatorLinkForProduct(params: {
  referralCode: string;
  productId: string;
  storefrontBaseUrl: string;
  storefrontPath?: string | null;
  operatorId?: string | null;
}) {
  const product = await getNetworkProduct(params.productId);
  if (!product) return null;

  const creator = await prisma.creatorProfile.findUnique({
    where: { referralCode: params.referralCode },
  });
  if (!creator) return null;

  let operatorId = params.operatorId ?? null;
  let storefrontPath = params.storefrontPath?.trim() || null;

  if (storefrontPath && !operatorId) {
    const storefront = await getStorefrontByPath(storefrontPath);
    operatorId = storefront?.operatorId ?? null;
  }

  if (operatorId) {
    const visible = await getOperatorProduct(operatorId, params.productId);
    if (!visible) return null;
  }

  const slugBase = params.productId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
  const slug = `CR_${slugBase}_${Date.now().toString(36).toUpperCase()}`;

  const link = await prisma.creatorLink.create({
    data: {
      creatorId: creator.id,
      productId: params.productId,
      operatorId,
      slug,
      label: product.title,
      cookieDays: 30,
      active: true,
    },
  });

  const path = storefrontPath
    ? `/${storefrontPath}/products/${product.id}?ref=${encodeURIComponent(slug)}`
    : `/marketplace/products/${product.id}?ref=${encodeURIComponent(slug)}`;
  const url = `${params.storefrontBaseUrl.replace(/\/$/, "")}${path}`;

  return { link, url, code: slug, productId: product.id, operatorId, storefrontPath };
}
