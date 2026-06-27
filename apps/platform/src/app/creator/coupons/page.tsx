import { DeferredFeatureNotice } from "@/components/deferred-feature-notice";

export default function CreatorCouponsPage() {
  return (
    <DeferredFeatureNotice
      title="Creator coupons"
      description="Creator coupon codes require a Coupon model. This area is deferred until the promotions schema ships."
    />
  );
}
