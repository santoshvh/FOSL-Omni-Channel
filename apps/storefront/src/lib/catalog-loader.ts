import type { Product } from "@fosl/contracts";
import {
  getDefaultOperatorId,
  getNetworkProduct,
  getOperatorProduct,
  listNetworkCategories,
  listNetworkProductsByCategorySlug,
  listNetworkVendors,
  searchNetworkProducts,
  categoryMetaFromSlug,
  categorySlugFromName,
  findVendorBySlug,
  findVendorById,
  mapDbProduct,
} from "@fosl/db";
import {
  getProductById as mockGetProductById,
  products as mockProducts,
  marketplaceCategories,
  marketplaceVendors,
  searchMarketplaceProducts,
  getProductsByCategorySlug,
  getMarketplaceVendorById,
  getMarketplaceVendorBySlug,
  getProductsByVendorId,
} from "@fosl/mocks";

export async function loadProductById(
  id: string,
  scope: "operator" | "network" = "network"
): Promise<Product | undefined> {
  if (process.env.DATABASE_URL) {
    if (scope === "operator") {
      const operatorId = await getDefaultOperatorId();
      if (operatorId) {
        const product = await getOperatorProduct(operatorId, id);
        if (product) return product;
      }
    }
    const product = await getNetworkProduct(id);
    return product ?? undefined;
  }
  return mockGetProductById(id);
}

export async function loadFeaturedProducts(limit = 4): Promise<Product[]> {
  if (process.env.DATABASE_URL) {
    const operatorId = await getDefaultOperatorId();
    if (operatorId) {
      const { listOperatorProducts } = await import("@fosl/db");
      const items = await listOperatorProducts(operatorId);
      return items.slice(0, limit);
    }
  }
  return mockProducts.slice(0, limit);
}

export async function loadMarketplaceCategories() {
  if (process.env.DATABASE_URL) {
    const cats = await listNetworkCategories();
    const imageBySlug = Object.fromEntries(
      marketplaceCategories.map((c) => [c.slug, c.imageUrl])
    );
    return cats.map((c) => ({
      ...c,
      imageUrl: imageBySlug[c.slug] ?? marketplaceCategories[0]!.imageUrl,
    }));
  }
  return marketplaceCategories;
}

export async function loadMarketplaceVendors() {
  if (process.env.DATABASE_URL) {
    return listNetworkVendors();
  }
  return marketplaceVendors;
}

export async function loadCategoryProducts(slug: string) {
  if (process.env.DATABASE_URL) {
    const meta = categoryMetaFromSlug(slug);
    const products = await listNetworkProductsByCategorySlug(slug);
    return { meta, products };
  }
  const category = marketplaceCategories.find((c) => c.slug === slug);
  return {
    meta: category ? { slug: category.slug, name: category.name } : { slug, name: slug },
    products: getProductsByCategorySlug(slug),
  };
}

export async function loadMarketplaceSearch(q: string) {
  if (process.env.DATABASE_URL) {
    return searchNetworkProducts(q);
  }
  return searchMarketplaceProducts(q);
}

export async function loadVendorStore(slugOrId: string) {
  if (process.env.DATABASE_URL) {
    let vendor = await findVendorBySlug(slugOrId);
    if (!vendor) vendor = await findVendorById(slugOrId);
    if (vendor) {
      return {
        vendor: {
          id: vendor.id,
          name: vendor.name,
          slug: vendor.slug,
          tagline: vendor.tagline,
          logoUrl: vendor.logoUrl,
          bannerUrl: vendor.bannerUrl,
        },
        products: vendor.products.map((p) =>
          mapDbProduct({ ...p, vendor: { id: vendor.id, name: vendor.name } })
        ),
      };
    }
  }
  const vendor = getMarketplaceVendorById(slugOrId) ?? getMarketplaceVendorBySlug(slugOrId);
  if (!vendor) return null;
  return { vendor, products: getProductsByVendorId(vendor.id) };
}

export async function loadMarketplaceVendor(id: string) {
  const store = await loadVendorStore(id);
  if (!store) return null;
  if (process.env.DATABASE_URL) {
    const vendors = await listNetworkVendors();
    const meta = vendors.find((v) => v.id === id);
    if (meta) {
      return {
        ...store,
        vendor: {
          ...store.vendor,
          rating: meta.rating,
          reviewCount: meta.reviewCount,
          productCount: meta.productCount,
          storefrontUrl: meta.storefrontUrl,
        },
      };
    }
  }
  return store;
}

export async function loadRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (process.env.DATABASE_URL) {
    const slug = categorySlugFromName(product.category);
    const items = await listNetworkProductsByCategorySlug(slug);
    return items.filter((p) => p.id !== product.id).slice(0, limit);
  }
  return getProductsByCategorySlug(categorySlugFromName(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}
