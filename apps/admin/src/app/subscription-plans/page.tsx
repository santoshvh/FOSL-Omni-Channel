import { Button, formatCurrency } from "@fosl/ui";

const plans = [
  {
    name: "Starter",
    priceCents: 4900,
    feePct: 2.5,
    features: ["1 storefront", "Up to 5 vendors", "Basic analytics"],
  },
  {
    name: "Professional",
    priceCents: 14900,
    feePct: 2.0,
    features: ["3 storefronts", "Unlimited vendors", "Custom domain", "Promotions"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    priceCents: 49900,
    feePct: 1.5,
    features: ["Unlimited storefronts", "SLA", "Dedicated support", "API access"],
  },
];

export default function SubscriptionPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription plans</h1>
        <p className="text-slate-600">Operator tiers and per-transaction fees (Stripe Billing)</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg border p-6 ${
              plan.highlighted ? "border-[#2E75B6] ring-2 ring-[#2E75B6]/20" : "border-slate-200 bg-white"
            }`}
          >
            <h2 className="text-lg font-bold">{plan.name}</h2>
            <p className="mt-2">
              <span className="text-3xl font-bold">{formatCurrency(plan.priceCents)}</span>
              <span className="text-slate-500">/mo</span>
            </p>
            <p className="mt-1 text-sm text-slate-500">+ {plan.feePct}% platform fee per order</p>
            <ul className="mt-4 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <Button className="mt-6 w-full" variant={plan.highlighted ? "default" : "outline"}>
              Edit plan
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
