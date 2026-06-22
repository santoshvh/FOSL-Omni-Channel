export type UserRole = "admin" | "operator" | "vendor" | "creator" | "customer";

export type ProductType = "physical" | "digital" | "lead_gen";

export type CatalogSource = "native" | "shopify" | "woocommerce";

export type IntegrationStatus = "connected" | "syncing" | "error" | "disconnected";

export type SubscriptionState =
  | "trial"
  | "active"
  | "past_due"
  | "grace_period"
  | "suspended"
  | "cancelled"
  | "enterprise";

export type LedgerState = "pending" | "cleared" | "paid" | "reversed";

export interface Product {
  id: string;
  sku: string;
  title: string;
  /** Short summary shown near price (WooCommerce excerpt) */
  description: string;
  /** Full HTML-style description for Description tab */
  fullDescription?: string;
  type: ProductType;
  priceCents: number;
  currency: string;
  inventory: number;
  vendorId: string;
  vendorName: string;
  imageUrl: string;
  galleryUrls?: string[];
  category: string;
  tags?: string[];
  attributes?: { name: string; value: string }[];
  rating?: number;
  reviewCount?: number;
  published: boolean;
  catalogSource: CatalogSource;
}

export interface ShippingMethod {
  id: string;
  vendorId: string;
  name: string;
  priceCents: number;
  estimatedDays: string;
  zone: string;
}

export interface CartLineItem {
  productId: string;
  product: Product;
  quantity: number;
  shippingMethodId?: string;
}

export interface VendorIntegration {
  id: string;
  platform: "shopify" | "woocommerce";
  storeUrl: string;
  status: IntegrationStatus;
  lastSyncAt: string;
  syncShipping: boolean;
  productsSynced: number;
  shippingZonesSynced: number;
}

export interface SyncJob {
  id: string;
  integrationId: string;
  entity: "products" | "inventory" | "shipping";
  status: "success" | "partial" | "failed";
  added: number;
  updated: number;
  failed: number;
  startedAt: string;
  errorMessage?: string;
}

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  roles: UserRole[];
  activeRole: UserRole;
}

export * from "./schemas";
