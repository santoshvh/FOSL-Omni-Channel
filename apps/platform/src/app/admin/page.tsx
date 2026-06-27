import { StatCard, StatCardCurrency } from "@fosl/ui";
import { Activity, CreditCard, ShoppingCart, Users } from "lucide-react";
import { getAdminMetrics } from "@fosl/db";

export const dynamic = "force-dynamic";

async function loadMetrics() {
  if (!process.env.DATABASE_URL) {
    return {
      operatorCount: 47,
      ordersLast30Days: 12840,
      revenueCentsLast30Days: 45230000,
      checkoutUptimePct: 99.94,
    };
  }
  return getAdminMetrics();
}

export default async function AdminDashboardPage() {
  const metrics = await loadMetrics();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Welcome back</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
            Sales &amp; platform overview
          </h1>
          <p className="mt-2 text-slate-600">
            Multi-operator social commerce — insights across GMV, operators, and health
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-card">
          Last 30 days
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCardCurrency
          label="Total revenue"
          cents={metrics.revenueCentsLast30Days}
          hint="Last 30 days"
          trend="up"
          icon={CreditCard}
          accent="primary"
        />
        <StatCard
          label="Active operators"
          value={String(metrics.operatorCount)}
          hint="On platform"
          trend="up"
          icon={Users}
          accent="blue"
        />
        <StatCard
          label="Orders"
          value={metrics.ordersLast30Days.toLocaleString()}
          hint="Last 30 days"
          trend="up"
          icon={ShoppingCart}
          accent="green"
        />
        <StatCard
          label="Sync success"
          value={`${metrics.checkoutUptimePct}%`}
          hint="Catalog sync jobs"
          trend="up"
          icon={Activity}
          accent="amber"
        />
      </div>
    </div>
  );
}
