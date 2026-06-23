import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { VendorConflictBanner } from "@/components/vendor-conflict-banner";
import {
  Button,
  StatCard,
  StatCardCurrency,
  IntegrationStatusBadge,
} from "@fosl/ui";
import { integrations, syncJobs } from "@fosl/mocks";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function VendorDashboardPage() {
  const lastSync = syncJobs[0];

  return (
    <HubShell>
      <div className="space-y-6">
        <VendorConflictBanner />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Vendor dashboard</h1>
            <p className="text-slate-600">Acme Audio Co. · Catalog synced from Shopify</p>
          </div>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync now
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardCurrency label="Revenue (30d)" cents={124500} hint="+12% vs last month" trend="up" />
          <StatCard label="Orders" value="38" hint="6 pending fulfillment" />
          <StatCard label="Products listed" value="128" hint="2 low stock" trend="neutral" />
          <StatCard label="Operator storefronts" value="4" hint="All approved" trend="up" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Connected stores</h2>
            <ul className="mt-4 space-y-3">
              {integrations.map((int) => (
                <li
                  key={int.id}
                  className="flex items-center justify-between rounded-md border border-slate-100 p-3"
                >
                  <div>
                    <p className="font-medium capitalize">{int.platform}</p>
                    <p className="text-sm text-slate-500">{int.storeUrl}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {int.productsSynced} products · {int.shippingZonesSynced} shipping zones
                    </p>
                  </div>
                  <IntegrationStatusBadge status={int.status} />
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/vendor/integrations">Manage integrations</Link>
            </Button>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Last sync</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Entity</dt>
                <dd className="font-medium capitalize">{lastSync.entity}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Status</dt>
                <dd className="font-medium capitalize text-green-600">{lastSync.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Updated</dt>
                <dd>{lastSync.updated} SKUs</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Time</dt>
                <dd>{new Date(lastSync.startedAt).toLocaleString()}</dd>
              </div>
            </dl>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/vendor/integrations/history">View sync history</Link>
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-medium text-amber-900">Low inventory alert</p>
            <p className="text-sm text-amber-800">
              Ceramic Travel Mug (MUG-202) has 18 units left. WooCommerce sync will update inventory in ~12 min.
            </p>
          </div>
        </div>
      </div>
    </HubShell>
  );
}
