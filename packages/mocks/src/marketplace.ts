import { products } from "./fixtures";

export interface MarketplaceCategory {
  slug: string;
  name: string;
  productCount: number;
  imageUrl: string;
}

export interface MarketplaceVendor {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  bannerUrl: string;
  logoUrl: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  followers: number;
  storefrontUrl: string;
  operatorName: string;
}

export const marketplaceCategories: MarketplaceCategory[] = [
  {
    slug: "electronics",
    name: "Electronics",
    productCount: 124,
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
  },
  {
    slug: "courses",
    name: "Courses & Digital",
    productCount: 86,
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
  },
  {
    slug: "home",
    name: "Home & Kitchen",
    productCount: 203,
    imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400",
  },
  {
    slug: "consulting",
    name: "Consulting & Leads",
    productCount: 42,
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
  },
];

export const marketplaceVendors: MarketplaceVendor[] = [
  {
    id: "ven_1",
    name: "Acme Audio Co.",
    slug: "acme-audio",
    tagline: "Premium audio gear for creators and commuters",
    bannerUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200",
    logoUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
    rating: 4.8,
    reviewCount: 312,
    productCount: 48,
    followers: 2840,
    storefrontUrl: "https://demo.fosl.store",
    operatorName: "Demo Storefront",
  },
  {
    id: "ven_4",
    name: "Bright Labs",
    slug: "bright-labs",
    tagline: "Thoughtful products for modern living",
    bannerUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200",
    logoUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200",
    rating: 4.6,
    reviewCount: 128,
    productCount: 22,
    followers: 920,
    storefrontUrl: "https://urban.fosl.store",
    operatorName: "Urban Market",
  },
  {
    id: "ven_2",
    name: "Creator Academy",
    slug: "creator-academy",
    tagline: "Courses and templates for online entrepreneurs",
    bannerUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200",
    rating: 4.9,
    reviewCount: 540,
    productCount: 12,
    followers: 6100,
    storefrontUrl: "https://demo.fosl.store",
    operatorName: "Demo Storefront",
  },
];

export function getMarketplaceVendorById(id: string) {
  return marketplaceVendors.find((v) => v.id === id);
}

export function getMarketplaceCategoryBySlug(slug: string) {
  return marketplaceCategories.find((c) => c.slug === slug);
}

const categoryMap: Record<string, string[]> = {
  electronics: ["Electronics"],
  courses: ["Education"],
  home: ["Home"],
  consulting: ["Services"],
};

export function getProductsByCategorySlug(slug: string) {
  const labels = categoryMap[slug] ?? [];
  if (labels.length === 0) return products;
  return products.filter((p) =>
    labels.some((l) => p.category.toLowerCase().includes(l.toLowerCase()))
  );
}

export function searchMarketplaceProducts(query: string) {
  const q = query.toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.vendorName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

export function getProductsByVendorId(vendorId: string) {
  return products.filter((p) => p.vendorId === vendorId);
}

/** Master marketplace cart — multi-vendor, multi-operator */
export const marketplaceCartProductIds = ["prod_1", "prod_4", "prod_2"];

export function getMarketplaceCartProducts() {
  return marketplaceCartProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;
}

export interface MasterOrder {
  id: string;
  number: string;
  createdAt: string;
  status: string;
  totalCents: number;
  fulfillments: {
    vendorName: string;
    operatorName: string;
    status: string;
    items: string[];
  }[];
}

export const masterOrders: MasterOrder[] = [
  {
    id: "mord_1",
    number: "MKT-2048",
    createdAt: "2026-03-14T16:20:00Z",
    status: "processing",
    totalCents: 26398,
    fulfillments: [
      {
        vendorName: "Acme Audio Co.",
        operatorName: "Demo Storefront",
        status: "shipped",
        items: ["Wireless Bluetooth Headphones"],
      },
      {
        vendorName: "Bright Labs",
        operatorName: "Urban Market",
        status: "processing",
        items: ["Ceramic Travel Mug"],
      },
    ],
  },
];

export function getMasterOrderById(id: string) {
  return masterOrders.find((o) => o.id === id);
}
