import { DeferredFeatureNotice } from "@/components/deferred-feature-notice";

export default function VendorCampaignsPage() {
  return (
    <DeferredFeatureNotice
      title="Campaigns"
      description="Marketing campaigns require a Campaign model. This area is deferred until the promotions schema ships."
    />
  );
}
