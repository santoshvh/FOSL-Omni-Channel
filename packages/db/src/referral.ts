import type { CreatorLink } from "@prisma/client";
import { prisma } from "./client";

/**
 * Resolve a ?ref= value to an active CreatorLink.
 * Accepts link slugs (e.g. ALEX_prod_5) or creator referral codes (e.g. ALEX2026).
 * When a referral code is used with a productId, finds or creates a product-scoped link.
 */
export async function resolveCreatorLinkForAttribution(
  ref: string,
  productId?: string | null
): Promise<CreatorLink | null> {
  const trimmed = ref.trim();
  if (!trimmed) return null;

  const bySlug = await prisma.creatorLink.findFirst({
    where: { slug: trimmed, active: true },
  });
  if (bySlug) return bySlug;

  const creator = await prisma.creatorProfile.findUnique({
    where: { referralCode: trimmed },
  });
  if (!creator) return null;

  if (productId) {
    const productLink = await prisma.creatorLink.findFirst({
      where: { creatorId: creator.id, productId, active: true },
    });
    if (productLink) return productLink;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { title: true },
    });
    if (!product) return null;

    const slug = `${trimmed}_${productId}`;
    return prisma.creatorLink.upsert({
      where: {
        creatorId_slug: { creatorId: creator.id, slug },
      },
      update: { productId, active: true },
      create: {
        creatorId: creator.id,
        productId,
        slug,
        label: product.title,
        cookieDays: 30,
        active: true,
      },
    });
  }

  return prisma.creatorLink.findFirst({
    where: { creatorId: creator.id, active: true, productId: null },
    orderBy: { createdAt: "asc" },
  });
}

export async function trackCreatorLinkClick(
  ref: string,
  productId?: string | null
): Promise<{ link: CreatorLink | null; tracked: boolean }> {
  const link = await resolveCreatorLinkForAttribution(ref, productId);
  if (!link) return { link: null, tracked: false };

  await prisma.creatorLink.update({
    where: { id: link.id },
    data: { clickCount: { increment: 1 } },
  });

  return { link, tracked: true };
}
