import { DeferredFeatureNotice } from "@/components/deferred-feature-notice";

export default function VendorCouponsPage() {
  return (
    <DeferredFeatureNotice
      title="Coupons"
      description="Vendor coupon codes require a Coupon model and CRUD APIs. This area is deferred until the promotions schema ships."
    />
  );
}
