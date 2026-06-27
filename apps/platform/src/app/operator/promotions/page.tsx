import { DeferredFeatureNotice } from "@/components/deferred-feature-notice";

export default function OperatorPromotionsPage() {
  return (
    <DeferredFeatureNotice
      title="Promotions"
      description="Promotion rules require a Promotion model. This area is deferred until the promotions schema ships."
    />
  );
}
