import type { Product, ProductType, CatalogSource } from "@fosl/contracts";
import type { Product as DbProduct, Vendor, ProductType as DbProductType, CatalogSource as DbCatalogSource } from "@prisma/client";

function toProductType(type: DbProductType): ProductType {
  if (type === "DIGITAL") return "digital";
  if (type === "LEAD_GEN") return "lead_gen";
  return "physical";
}

function toCatalogSource(source: DbCatalogSource): CatalogSource {
  if (source === "SHOPIFY") return "shopify";
  if (source === "WOOCOMMERCE") return "woocommerce";
  return "native";
}

export function mapDbProduct(
  product: DbProduct & { vendor: Pick<Vendor, "id" | "name"> }
): Product {
  return {
    id: product.id,
    sku: product.sku,
    title: product.title,
    description: product.description,
    fullDescription: product.fullDescription ?? undefined,
    type: toProductType(product.type),
    priceCents: product.priceCents,
    currency: product.currency,
    inventory: product.inventory,
    vendorId: product.vendorId,
    vendorName: product.vendor.name,
    imageUrl: product.imageUrl,
    galleryUrls: Array.isArray(product.galleryUrls)
      ? (product.galleryUrls as string[])
      : undefined,
    category: product.category,
    tags: Array.isArray(product.tags) ? (product.tags as string[]) : undefined,
    attributes: Array.isArray(product.attributes)
      ? (product.attributes as { name: string; value: string }[])
      : undefined,
    rating: product.rating != null ? Number(product.rating) : undefined,
    reviewCount: product.reviewCount,
    published: product.published,
    catalogSource: toCatalogSource(product.catalogSource),
  };
}
