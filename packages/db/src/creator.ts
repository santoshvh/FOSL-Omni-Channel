import { prisma } from "./client";

const linkProductSelect = {
  id: true,
  title: true,
  imageUrl: true,
  type: true,
  priceCents: true,
  vendor: { select: { name: true } },
} as const;

const linkOrder = [
  { featured: "desc" as const },
  { featuredOrder: "asc" as const },
  { createdAt: "desc" as const },
];

export function buildReferralProductUrl(params: {
  baseUrl: string;
  productId: string;
  refSlug: string;
  storefrontPath?: string | null;
  addToCart?: boolean;
}) {
  const base = params.baseUrl.replace(/\/$/, "");
  const path = params.storefrontPath
    ? `/${params.storefrontPath}/products/${params.productId}`
    : `/marketplace/products/${params.productId}`;
  const url = new URL(path, base);
  url.searchParams.set("ref", params.refSlug);
  if (params.addToCart) url.searchParams.set("add", "1");
  return url.toString();
}

export async function getPublicCreatorByReferralCode(referralCode: string) {
  const profile = await prisma.creatorProfile.findUnique({
    where: { referralCode },
    select: {
      displayName: true,
      referralCode: true,
      links: {
        where: { active: true, productId: { not: null } },
        orderBy: linkOrder,
        include: { product: { select: linkProductSelect } },
        take: 24,
      },
    },
  });
  if (!profile) return null;

  const featured = profile.links.filter((l) => l.featured && l.product);
  const products =
    featured.length > 0
      ? featured.map((l) => ({ link: l, product: l.product! }))
      : profile.links.filter((l) => l.product).map((l) => ({ link: l, product: l.product! }));

  return {
    displayName: profile.displayName,
    referralCode: profile.referralCode,
    products: products.slice(0, 12),
  };
}

export async function setCreatorLinkFeatured(userId: string, linkId: string, featured: boolean) {
  const profile = await prisma.creatorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) return null;

  const link = await prisma.creatorLink.findFirst({
    where: { id: linkId, creatorId: profile.id, productId: { not: null } },
  });
  if (!link) return null;

  let featuredOrder: number | null = link.featuredOrder;
  if (featured && featuredOrder == null) {
    const max = await prisma.creatorLink.aggregate({
      where: { creatorId: profile.id, featured: true },
      _max: { featuredOrder: true },
    });
    featuredOrder = (max._max.featuredOrder ?? 0) + 1;
  }
  if (!featured) featuredOrder = null;

  return prisma.creatorLink.update({
    where: { id: linkId },
    data: { featured, featuredOrder },
    include: { product: { select: linkProductSelect } },
  });
}

export async function ensureCreatorProductLink(userId: string, productId: string) {
  const profile = await prisma.creatorProfile.findUnique({
    where: { userId },
    select: { id: true, referralCode: true },
  });
  if (!profile) return null;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, title: true },
  });
  if (!product) return null;

  const slug = `${profile.referralCode}_${productId}`;
  return prisma.creatorLink.upsert({
    where: { creatorId_slug: { creatorId: profile.id, slug } },
    update: { productId, active: true },
    create: {
      creatorId: profile.id,
      productId,
      slug,
      label: product.title,
      cookieDays: 30,
      active: true,
    },
    include: { product: { select: linkProductSelect } },
  });
}
