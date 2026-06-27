import { StatCard } from "@fosl/ui";
import { getAdminHealthMetrics } from "@fosl/db";

export const dynamic = "force-dynamic";

async function loadHealth() {
  if (!process.env.DATABASE_URL) return null;
  return getAdminHealthMetrics();
}

export default async function AdminHealthPage() {
  const metrics = await loadHealth();

  if (!metrics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System health</h1>
          <p className="text-slate-600">Connect a database to view live integration health.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System health</h1>
        <p className="text-slate-600">Integration sync jobs and service status (last 24h)</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sync success (24h)" value={`${metrics.syncSuccessPct24h}%`} trend="up" />
        <StatCard label="Failed syncs (24h)" value={String(metrics.failedSyncs24h)} />
        <StatCard label="Queue depth" value={String(metrics.queueDepth)} />
        <StatCard
          label="Connected integrations"
          value={String(metrics.integrationCount)}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Services</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between">
              <span>MySQL</span>
              <span className={metrics.dbHealthy ? "text-green-600" : "text-red-600"}>
                {metrics.dbHealthy ? "Healthy" : "Unreachable"}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Stripe</span>
              <span className={metrics.stripeConfigured ? "text-green-600" : "text-amber-600"}>
                {metrics.stripeConfigured ? "Configured" : "Not configured"}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Catalog sync workers</span>
              <span className="text-green-600">Active</span>
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Integration sync (24h)</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Shopify success rate</span>
              <span>{metrics.shopifySuccessPct}%</span>
            </li>
            <li className="flex justify-between">
              <span>WooCommerce success rate</span>
              <span>{metrics.wooSuccessPct}%</span>
            </li>
            <li className="flex justify-between">
              <span>Failed syncs</span>
              <span className={metrics.failedSyncs24h > 0 ? "text-amber-600" : ""}>
                {metrics.failedSyncs24h}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
