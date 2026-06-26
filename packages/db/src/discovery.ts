import { prisma } from "./client";
import { mapDbProduct } from "./mappers";

const approvedVendorFilter = {
  operatorLinks: {
    some: { status: "APPROVED" as const, scope: "CATALOG_WIDE" as const },
  },
};

export async function listNetworkVendors() {
  const vendors = await prisma.vendor.findMany({
    where: {
      products: { some: { published: true } },
      ...approvedVendorFilter,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      logoUrl: true,
      bannerUrl: true,
      products: {
        where: { published: true },
        select: { id: true, rating: true, reviewCount: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return vendors.map((vendor) => {
    const ratings = vendor.products
      .map((p) => (p.rating != null ? Number(p.rating) : null))
      .filter((r): r is number => r != null);
    const reviewCount = vendor.products.reduce((sum, p) => sum + (p.reviewCount ?? 0), 0);
    const avgRating =
      ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

    return {
      id: vendor.id,
      name: vendor.name,
      slug: vendor.slug,
      tagline: vendor.tagline,
      logoUrl: vendor.logoUrl,
      bannerUrl: vendor.bannerUrl,
      productCount: vendor.products.length,
      rating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      reviewCount,
      storefrontUrl: `/${vendor.slug}`,
    };
  });
}

export async function listNetworkCategories() {
  const rows = await prisma.product.groupBy({
    by: ["category"],
    where: {
      published: true,
      vendor: approvedVendorFilter,
    },
    _count: { _all: true },
  });

  return rows
    .filter((row) => row.category.trim())
    .map((row) => ({
      slug: row.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: row.category,
      productCount: row._count._all,
    }))
    .sort((a, b) => b.productCount - a.productCount);
}

export async function searchNetworkProducts(query: string, limit = 48) {
  const q = query.trim();
  if (!q) return [];

  const products = await prisma.product.findMany({
    where: {
      published: true,
      vendor: approvedVendorFilter,
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
        { vendor: { name: { contains: q } } },
      ],
    },
    include: { vendor: { select: { id: true, name: true } } },
    take: limit,
    orderBy: { title: "asc" },
  });

  return products.map(mapDbProduct);
}
