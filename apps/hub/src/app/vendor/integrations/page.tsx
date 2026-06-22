import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, IntegrationStatusBadge } from "@fosl/ui";
import { integrations } from "@fosl/mocks";
import { Plus } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Store integrations</h1>
            <p className="text-slate-600">
              Sync products, inventory, and shipping from Shopify or WooCommerce
            </p>
          </div>
          <Button asChild>
            <Link href="/vendor/integrations/connect">
              <Plus className="mr-2 h-4 w-4" />
              Connect store
            </Link>
          </Button>
        </div>

        <div className="grid gap-4">
          {integrations.map((int) => (
            <div
              key={int.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-6"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold capitalize">{int.platform}</h2>
                  <IntegrationStatusBadge status={int.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{int.storeUrl}</p>
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
                  <div>
                    <dt className="text-slate-500">Products</dt>
                    <dd className="font-medium">{int.productsSynced}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Shipping zones</dt>
                    <dd className="font-medium">{int.shippingZonesSynced}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Sync shipping</dt>
                    <dd className="font-medium">{int.syncShipping ? "Yes" : "No"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Last sync</dt>
                    <dd className="font-medium">
                      {new Date(int.lastSyncAt).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Sync now
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/vendor/integrations/history">History</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HubShell>
  );
}
