import { DeferredFeatureNotice } from "@/components/deferred-feature-notice";

export default function OperatorCouponsPage() {
  return (
    <DeferredFeatureNotice
      title="Operator coupons"
      description="Operator-funded coupons require a Coupon model. This area is deferred until the promotions schema ships."
    />
  );
}
