import { StatCard, StatCardCurrency } from "@fosl/ui";
import { Activity, CreditCard, ShoppingCart, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
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
          cents={45230000}
          hint="+15.2% vs last month"
          trend="up"
          icon={CreditCard}
          accent="primary"
        />
        <StatCard
          label="Active operators"
          value="47"
          hint="+3 new this month"
          trend="up"
          icon={Users}
          accent="blue"
        />
        <StatCard
          label="Orders"
          value="12,840"
          hint="+8.4% vs last month"
          trend="up"
          icon={ShoppingCart}
          accent="green"
        />
        <StatCard
          label="Checkout uptime"
          value="99.94%"
          hint="Stripe + sync path"
          trend="up"
          icon={Activity}
          accent="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Revenue trend</h2>
            <span className="text-xs font-medium text-green-600">+15% growth</span>
          </div>
          <div className="mt-6 flex h-48 items-end justify-between gap-2 px-2">
            {[42, 55, 48, 70, 62, 78, 85, 72, 90, 88, 95, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-primary/80 transition hover:bg-primary"
                style={{ height: `${h}%` }}
                title={`Month ${i + 1}`}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-center text-sm">
            <div>
              <p className="text-slate-500">Avg. order</p>
              <p className="font-semibold text-ink">$86.40</p>
            </div>
            <div>
              <p className="text-slate-500">Conversion</p>
              <p className="font-semibold text-ink">3.2%</p>
            </div>
            <div>
              <p className="text-slate-500">Refund rate</p>
              <p className="font-semibold text-ink">1.1%</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-ink">Top operators</h2>
          <ul className="mt-4 space-y-4">
            {[
              { name: "Demo Storefront", gmv: "$182k", share: 40 },
              { name: "Urban Market", gmv: "$124k", share: 27 },
              { name: "Creator Academy", gmv: "$89k", share: 20 },
            ].map((op) => (
              <li key={op.name}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-ink">{op.name}</span>
                  <span className="text-slate-500">{op.gmv}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${op.share}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-ink">Integration health</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
              <dt>Shopify sync success</dt>
              <dd className="font-semibold text-green-600">98.2%</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
              <dt>WooCommerce sync success</dt>
              <dd className="font-semibold text-green-600">96.8%</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
              <dt>Failed syncs (24h)</dt>
              <dd className="font-semibold text-amber-600">12</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-ink">Action required</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
              3 operators in grace period — checkout disabled
            </li>
            <li className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-900">
              2 disputes awaiting assignment
            </li>
            <li className="rounded-xl border border-slate-200 bg-surface px-4 py-3 text-slate-700">
              Subscription renewals due in 7 days (5 operators)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
