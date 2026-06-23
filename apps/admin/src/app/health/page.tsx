import { StatCard } from "@fosl/ui";

export default function AdminHealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System health</h1>
        <p className="text-slate-600">API latency, queue depth, error rates</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="API uptime" value="99.94%" trend="up" />
        <StatCard label="P95 latency" value="142ms" />
        <StatCard label="Error rate" value="0.08%" />
        <StatCard label="Sync queue depth" value="3" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Services</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between">
              <span>MySQL 8</span>
              <span className="text-green-600">Healthy</span>
            </li>
            <li className="flex justify-between">
              <span>Stripe webhooks</span>
              <span className="text-green-600">Healthy</span>
            </li>
            <li className="flex justify-between">
              <span>Catalog sync workers</span>
              <span className="text-green-600">Healthy</span>
            </li>
            <li className="flex justify-between">
              <span>Email (Postmark)</span>
              <span className="text-green-600">Healthy</span>
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Integration sync (24h)</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Shopify success rate</span>
              <span>98.2%</span>
            </li>
            <li className="flex justify-between">
              <span>WooCommerce success rate</span>
              <span>96.8%</span>
            </li>
            <li className="flex justify-between">
              <span>Failed syncs</span>
              <span className="text-amber-600">12</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
