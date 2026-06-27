import { DeferredFeatureNotice } from "@/components/deferred-feature-notice";

export default function CreatorCollectionsPage() {
  return (
    <DeferredFeatureNotice
      title="Collections"
      description="Curated product collections require a Collection model. This area is deferred until the schema ships."
    />
  );
}
