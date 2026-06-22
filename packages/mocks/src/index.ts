export {
  demoSession,
  products,
  shippingMethods,
  integrations,
  syncJobs,
  getProductById,
  getShippingForVendor,
} from "./fixtures";

export {
  enrichProduct,
  getRelatedProducts,
  getProductsByVendor,
  getProductByIdEnriched,
} from "./product-details";

export {
  marketplaceCategories,
  marketplaceVendors,
  getMarketplaceVendorById,
  getMarketplaceCategoryBySlug,
  getProductsByCategorySlug,
  searchMarketplaceProducts,
  getProductsByVendorId,
  getMarketplaceCartProducts,
  masterOrders,
  getMasterOrderById,
} from "./marketplace";
export type { MarketplaceCategory, MarketplaceVendor, MasterOrder } from "./marketplace";

export {
  mockOrders,
  getOrderById,
  vendorRelationships,
  vendorCoupons,
  creatorCoupons,
  creatorCollections,
  referralTree,
  platformOperators,
  getPlatformOperatorById,
  disputes,
  getDisputeById,
  auditLogs,
  operatorVendors,
  getOperatorVendorById,
  operatorPromotions,
  vendorCampaigns,
} from "./hub-data";
export type {
  MockOrder,
  MockCollection,
  PlatformOperator,
  MockDispute,
  DisputeDetail,
  AuditEntry,
  ReferralNode,
  OperatorVendor,
  Promotion,
  VendorCampaign,
} from "./hub-data";
