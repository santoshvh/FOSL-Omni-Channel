import { HubShell } from "@/components/hub-shell";
import { OperatorStorefrontClient } from "@/components/operator-storefront-client";

export default function OperatorStorefrontPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Storefronts & API keys</h1>
          <p className="text-slate-600">
            Multiple shops per operator — path-based, custom domain, or self-hosted via publishable key.
          </p>
        </div>
        <OperatorStorefrontClient />
      </div>
    </HubShell>
  );
}
