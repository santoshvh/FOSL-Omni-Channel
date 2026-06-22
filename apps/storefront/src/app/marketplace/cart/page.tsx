"use client";

import Link from "next/link";
import { getMarketplaceCartProducts, getShippingForVendor } from "@fosl/mocks";
import { Button, ProductTypeBadge, formatCurrency, Input, Label } from "@fosl/ui";

export default function MarketplaceCartPage() {
  const cartItems = getMarketplaceCartProducts();
  const subtotal = cartItems.reduce((s, p) => s + p.priceCents, 0);

  // Group by vendor AND operator (multi-vendor master cart)
  const groups = cartItems.reduce<
    Record<string, { vendorName: string; operatorName: string; items: typeof cartItems }>
  >((acc, p) => {
    const key = p.vendorId;
    if (!acc[key]) {
      const operator =
        p.vendorId === "ven_4" ? "Urban Market" : "Demo Storefront";
      acc[key] = { vendorName: p.vendorName, operatorName: operator, items: [] };
    }
    acc[key].items.push(p);
    return acc;
  }, {});

  const physicalVendorIds = [
    ...new Set(cartItems.filter((p) => p.type === "physical").map((p) => p.vendorId)),
  ];
  const shippingTotal = physicalVendorIds.reduce((s, vid) => {
    return s + (getShippingForVendor(vid)[0]?.priceCents ?? 0);
  }, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Marketplace cart</h1>
      <p className="text-slate-600">
        Items grouped by vendor — single payment, split fulfillment across operators
      </p>

      <div className="mt-8 space-y-6">
        {Object.entries(groups).map(([vid, group]) => (
          <div key={vid} className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h2 className="font-semibold">{group.vendorName}</h2>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-[#2E75B6]">
                Fulfilled via {group.operatorName}
              </span>
            </div>
            <ul className="mt-3 divide-y">
              {group.items.map((p) => (
                <li key={p.id} className="flex justify-between py-3">
                  <div>
                    <ProductTypeBadge type={p.type} />
                    <p className="mt-1 font-medium">{p.title}</p>
                    {p.type === "digital" && (
                      <p className="text-xs text-purple-600">Instant delivery — no shipping</p>
                    )}
                  </div>
                  <p className="font-semibold">{formatCurrency(p.priceCents)}</p>
                </li>
              ))}
            </ul>
            {group.items.some((p) => p.type === "physical") && (
              <p className="mt-2 text-sm text-slate-500">
                Shipping estimate: {formatCurrency(getShippingForVendor(vid)[0]?.priceCents ?? 0)}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Master order:</strong> One Stripe payment covers all vendors. Commissions and payouts
        are split automatically per the checkout snapshot.
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <Label htmlFor="coupon">Marketplace coupon</Label>
        <div className="mt-2 flex gap-2">
          <Input id="coupon" placeholder="Enter code" />
          <Button variant="outline">Apply</Button>
        </div>
      </div>

      <dl className="mt-6 space-y-2 border-t pt-4">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <dt>Shipping (per vendor)</dt>
          <dd>{formatCurrency(shippingTotal)}</dd>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <dt>Total</dt>
          <dd>{formatCurrency(subtotal + shippingTotal)}</dd>
        </div>
      </dl>

      <Button asChild className="mt-6 w-full" size="lg">
        <Link href="/marketplace/checkout">Proceed to unified checkout</Link>
      </Button>
    </div>
  );
}
