import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { VendorConflictBanner } from "@/components/vendor-conflict-banner";
import {
  Button,
  StatCard,
  StatCardCurrency,
  IntegrationStatusBadge,
} from "@fosl/ui";
import { auth } from "@/auth";
import { resolveVendorIdForApi } from "@/lib/tenant-session";
import { getVendorDashboardSummary } from "@fosl/db";
import { listVendorIntegrations } from "@fosl/db";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default async function VendorDashboardPage() {
  const session = await auth();
  const vendorId = await resolveVendorIdForApi(session);

  if (!process.env.DATABASE_URL || !vendorId) {
    return (
      <HubShell>
        <p className="text-slate-600">Connect a database and sign in as a vendor member to view dashboard data.</p>
      </HubShell>
    );
  }

  const summary = await getVendorDashboardSummary(vendorId);
  const integrations = await listVendorIntegrations(vendorId);
  const lastSync = summary.lastSyncJob;

  return (
    <HubShell>
      <div className="space-y-6">
        <VendorConflictBanner />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Vendor dashboard</h1>
            <p className="text-slate-600">
              {summary.vendor?.name ?? "Your vendor"} · Catalog and integrations
            </p>
          </div>
          <Button asChild>
            <Link href="/vendor/integrations">
              <RefreshCw className="mr-2 h-4 w-4" />
              Manage sync
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardCurrency
            label="Revenue (30d)"
            cents={summary.revenueCentsLast30Days}
            hint="From order lines"
            trend="up"
          />
          <StatCard
            label="Orders"
            value={String(summary.orderCountLast30Days)}
            hint="Last 30 days"
          />
          <StatCard
            label="Products listed"
            value={String(summary.productCount)}
            hint={summary.lowStockCount > 0 ? `${summary.lowStockCount} low stock` : "Published SKUs"}
            trend="neutral"
          />
          <StatCard
            label="Operator storefronts"
            value={String(summary.approvedOperatorCount)}
            hint="Approved relationships"
            trend="up"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Connected stores</h2>
            {integrations.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No integrations connected yet.</p>
            ) : (
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
            )}
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/vendor/integrations">Manage integrations</Link>
            </Button>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Last sync</h2>
            {!lastSync ? (
              <p className="mt-4 text-sm text-slate-500">No sync jobs recorded yet.</p>
            ) : (
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
                  <dd>{lastSync.added + lastSync.updated} SKUs</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Time</dt>
                  <dd>{new Date(lastSync.startedAt).toLocaleString()}</dd>
                </div>
              </dl>
            )}
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/vendor/integrations/history">View sync history</Link>
            </Button>
          </div>
        </div>

        {summary.lowStockCount > 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-medium text-amber-900">Low inventory alert</p>
              <p className="text-sm text-amber-800">
                {summary.lowStockCount} physical product{summary.lowStockCount === 1 ? "" : "s"} at or below 20
                units. Review catalog inventory after your next sync.
              </p>
            </div>
          </div>
        )}
      </div>
    </HubShell>
  );
}
