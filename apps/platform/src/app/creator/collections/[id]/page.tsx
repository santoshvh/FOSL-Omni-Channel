import { DeferredFeatureNotice } from "@/components/deferred-feature-notice";

export default function CreatorCollectionDetailPage() {
  return (
    <DeferredFeatureNotice
      title="Collection detail"
      description="Collection editing requires a Collection model. This area is deferred until the schema ships."
    />
  );
}
