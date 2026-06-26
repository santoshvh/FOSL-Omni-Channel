import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { OperatorDomainsClient } from "@/components/operator-domains-client";

export default function OperatorDomainsPage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/operator/storefront" className="text-sm text-primary-dark hover:underline">
          ← Storefronts & API keys
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Domain management</h1>
          <p className="text-slate-600">
            Custom domains for operator storefronts — headless shops use CORS origins below.
          </p>
        </div>

        <OperatorDomainsClient />
      </div>
    </HubShell>
  );
}
