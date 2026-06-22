export interface MockOrderLine {
  productId: string;
  title: string;
  type: "physical" | "digital" | "lead_gen";
  qty: number;
  priceCents: number;
  vendorName: string;
}

export interface MockOrder {
  id: string;
  number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "lead_received";
  createdAt: string;
  totalCents: number;
  lines: MockOrderLine[];
  trackingNumber?: string;
  downloadUrl?: string;
  leadStatus?: string;
}

export const mockOrders: MockOrder[] = [
  {
    id: "ord_1",
    number: "ORD-1043",
    status: "processing",
    createdAt: "2026-03-15T14:22:00Z",
    totalCents: 13498,
    lines: [
      {
        productId: "prod_1",
        title: "Wireless Bluetooth Headphones",
        type: "physical",
        qty: 1,
        priceCents: 8999,
        vendorName: "Acme Audio Co.",
      },
      {
        productId: "prod_4",
        title: "Ceramic Travel Mug",
        type: "physical",
        qty: 1,
        priceCents: 2499,
        vendorName: "Bright Labs",
      },
    ],
    trackingNumber: "1Z999AA10123456784",
  },
  {
    id: "ord_2",
    number: "ORD-1038",
    status: "delivered",
    createdAt: "2026-03-10T09:15:00Z",
    totalCents: 14900,
    lines: [
      {
        productId: "prod_2",
        title: "E-Commerce Mastery Course",
        type: "digital",
        qty: 1,
        priceCents: 14900,
        vendorName: "Creator Academy",
      },
    ],
    downloadUrl: "https://demo.fosl.store/downloads/ecm-101.zip",
  },
  {
    id: "ord_3",
    number: "ORD-1035",
    status: "lead_received",
    createdAt: "2026-03-08T16:40:00Z",
    totalCents: 0,
    lines: [
      {
        productId: "prod_3",
        title: "30-Minute Strategy Consultation",
        type: "lead_gen",
        qty: 1,
        priceCents: 0,
        vendorName: "Northwind Growth",
      },
    ],
    leadStatus: "Vendor contacted — call scheduled Mar 12",
  },
];

export function getOrderById(id: string) {
  return mockOrders.find((o) => o.id === id);
}

export interface OperatorRelationship {
  id: string;
  operatorName: string;
  storefront: string;
  status: "pending" | "approved" | "rejected";
  scope: "catalog_wide" | "sku_level";
  minCommissionPct: number;
}

export const vendorRelationships: OperatorRelationship[] = [
  {
    id: "rel_1",
    operatorName: "Demo Storefront",
    storefront: "demo.fosl.store",
    status: "approved",
    scope: "catalog_wide",
    minCommissionPct: 8,
  },
  {
    id: "rel_2",
    operatorName: "Urban Market",
    storefront: "urban.fosl.store",
    status: "pending",
    scope: "sku_level",
    minCommissionPct: 10,
  },
];

export interface MockCoupon {
  id: string;
  code: string;
  scope: string;
  discount: string;
  expiresAt: string;
  redemptions: number;
  maxRedemptions?: number;
}

export const vendorCoupons: MockCoupon[] = [
  {
    id: "c1",
    code: "ACME10",
    scope: "Vendor-wide",
    discount: "10% off",
    expiresAt: "2026-06-30",
    redemptions: 42,
    maxRedemptions: 500,
  },
  {
    id: "c2",
    code: "WBH20OFF",
    scope: "Product: WBH-001",
    discount: "$20 off",
    expiresAt: "2026-04-15",
    redemptions: 8,
    maxRedemptions: 100,
  },
];

export interface MockCollection {
  id: string;
  name: string;
  productCount: number;
  earningsCents: number;
  imageUrl: string;
}

export const creatorCollections: MockCollection[] = [
  {
    id: "col_1",
    name: "Best Audio Gear",
    productCount: 4,
    earningsCents: 15200,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  },
  {
    id: "col_2",
    name: "Courses I Recommend",
    productCount: 2,
    earningsCents: 32600,
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
  },
];

export interface ReferralNode {
  id: string;
  label: string;
  level: 1 | 2;
  children?: ReferralNode[];
}

export const referralTree: ReferralNode = {
  id: "you",
  label: "You (Alex)",
  level: 1,
  children: [
    {
      id: "r1",
      label: "Jordan L.",
      level: 1,
      children: [
        { id: "r1a", label: "Sam K.", level: 2 },
        { id: "r1b", label: "Riley M.", level: 2 },
      ],
    },
    { id: "r2", label: "Casey P.", level: 1 },
  ],
};

export interface PlatformOperator {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "active" | "trial" | "suspended" | "grace_period";
  storefronts: number;
  gmvCents: number;
}

export const platformOperators: PlatformOperator[] = [
  {
    id: "op_1",
    name: "Demo Storefront Co.",
    email: "ops@demo.fosl.store",
    plan: "Professional",
    status: "active",
    storefronts: 1,
    gmvCents: 8924000,
  },
  {
    id: "op_2",
    name: "Urban Market LLC",
    email: "admin@urbanmarket.com",
    plan: "Starter",
    status: "grace_period",
    storefronts: 2,
    gmvCents: 1240000,
  },
];

export interface MockDispute {
  id: string;
  orderNumber: string;
  parties: string;
  status: "open" | "investigating" | "resolved";
  filedAt: string;
  assignee?: string;
}

export const disputes: MockDispute[] = [
  {
    id: "disp_1",
    orderNumber: "ORD-1021",
    parties: "Customer vs Acme Audio",
    status: "investigating",
    filedAt: "2026-03-14T11:00:00Z",
    assignee: "Admin Sarah",
  },
  {
    id: "disp_2",
    orderNumber: "ORD-998",
    parties: "Customer vs Bright Labs",
    status: "open",
    filedAt: "2026-03-15T08:30:00Z",
  },
];

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
}

export interface OperatorVendor {
  id: string;
  name: string;
  productsListed: number;
  commissionPct: number;
  status: "active" | "pending" | "suspended";
  revenueCents: number;
  integration: string;
}

export const operatorVendors: OperatorVendor[] = [
  {
    id: "ven_1",
    name: "Acme Audio Co.",
    productsListed: 48,
    commissionPct: 12,
    status: "active",
    revenueCents: 842000,
    integration: "Shopify",
  },
  {
    id: "ven_4",
    name: "Bright Labs",
    productsListed: 22,
    commissionPct: 15,
    status: "active",
    revenueCents: 403000,
    integration: "WooCommerce",
  },
];

export function getOperatorVendorById(id: string) {
  return operatorVendors.find((v) => v.id === id);
}

export const creatorCoupons: MockCoupon[] = [
  {
    id: "cc1",
    code: "ALEX15",
    scope: "Creator storefront",
    discount: "15% off",
    expiresAt: "2026-05-01",
    redemptions: 18,
    maxRedemptions: 200,
  },
];

export interface Promotion {
  id: string;
  name: string;
  type: "bundle" | "buy_x_get_y" | "commission_boost";
  status: "active" | "scheduled" | "ended";
  vendors: string;
  endsAt: string;
}

export const operatorPromotions: Promotion[] = [
  {
    id: "promo_1",
    name: "Spring Audio Bundle",
    type: "bundle",
    status: "active",
    vendors: "Acme Audio + Bright Labs",
    endsAt: "2026-04-30",
  },
  {
    id: "promo_2",
    name: "Buy 2 mugs, get 1 free",
    type: "buy_x_get_y",
    status: "scheduled",
    vendors: "Bright Labs",
    endsAt: "2026-06-15",
  },
];

export interface VendorCampaign {
  id: string;
  name: string;
  type: "commission_boost" | "featured_placement";
  boostPct: number;
  budgetCents: number;
  spentCents: number;
  status: "active" | "paused";
}

export const vendorCampaigns: VendorCampaign[] = [
  {
    id: "camp_1",
    name: "Headphones launch boost",
    type: "commission_boost",
    boostPct: 5,
    budgetCents: 50000,
    spentCents: 12400,
    status: "active",
  },
];

export interface DisputeDetail extends MockDispute {
  description: string;
  timeline: { at: string; note: string }[];
}

const disputeDetails: Record<string, DisputeDetail> = {
  disp_1: {
    id: "disp_1",
    orderNumber: "ORD-1021",
    parties: "Customer vs Acme Audio",
    status: "investigating",
    filedAt: "2026-03-14T11:00:00Z",
    assignee: "Admin Sarah",
    description: "Customer reports headphones arrived damaged. Requesting replacement or refund.",
    timeline: [
      { at: "2026-03-14T11:00:00Z", note: "Dispute filed by customer" },
      { at: "2026-03-14T14:30:00Z", note: "Assigned to Admin Sarah" },
      { at: "2026-03-15T09:00:00Z", note: "Vendor submitted photos of packaging" },
    ],
  },
  disp_2: {
    id: "disp_2",
    orderNumber: "ORD-998",
    parties: "Customer vs Bright Labs",
    status: "open",
    filedAt: "2026-03-15T08:30:00Z",
    description: "Mug arrived with hairline crack. Customer prefers partial refund.",
    timeline: [{ at: "2026-03-15T08:30:00Z", note: "Dispute filed — awaiting assignment" }],
  },
};

export function getDisputeById(id: string) {
  return disputeDetails[id];
}

export function getPlatformOperatorById(id: string) {
  return platformOperators.find((o) => o.id === id);
}

export const auditLogs: AuditEntry[] = [
  {
    id: "aud_1",
    timestamp: "2026-03-15T10:05:00Z",
    actor: "admin@fosl.platform",
    action: "operator.approved",
    resource: "Urban Market LLC",
  },
  {
    id: "aud_2",
    timestamp: "2026-03-15T09:42:00Z",
    actor: "alex@acmecatalog.com",
    action: "coupon.created",
    resource: "WBH20OFF",
  },
  {
    id: "aud_3",
    timestamp: "2026-03-15T09:15:00Z",
    actor: "system",
    action: "sync.completed",
    resource: "shopify:acme-audio",
  },
];
