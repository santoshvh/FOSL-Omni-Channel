"use client";

import Link from "next/link";
import { products, getShippingForVendor } from "@fosl/mocks";
import { Button, ProductTypeBadge, formatCurrency, Input, Label } from "@fosl/ui";
import { CreatorEarnButton } from "@/components/creator-earn-button";

export default function CartPage() {
  const cartItems = [products[0], products[3]];
  const subtotal = cartItems.reduce((s, p) => s + p.priceCents, 0);
  const vendorIds = [...new Set(cartItems.filter((p) => p.type === "physical").map((p) => p.vendorId))];
  const shippingTotal = vendorIds.reduce((s, vid) => {
    const methods = getShippingForVendor(vid);
    return s + (methods[0]?.priceCents ?? 0);
  }, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Your cart</h1>
      <p className="text-slate-600">Items grouped by vendor for shipping</p>

      <div className="mt-8 space-y-6">
        {vendorIds.map((vid) => {
          const vendorItems = cartItems.filter((p) => p.vendorId === vid);
          const vendorName = vendorItems[0]?.vendorName;
          return (
            <div key={vid} className="rounded-lg border border-slate-200 p-4">
              <h2 className="font-semibold text-slate-700">{vendorName}</h2>
              <ul className="mt-3 divide-y">
                {vendorItems.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <ProductTypeBadge type={p.type} />
                      <p className="mt-1 font-medium">{p.title}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-semibold">{formatCurrency(p.priceCents)}</p>
                      <CreatorEarnButton
                        productId={p.id}
                        productTitle={p.title}
                        variant="outline"
                      />
                    </div>
                  </li>
                ))}
              </ul>
              {vendorItems.some((p) => p.type === "physical") && (
                <p className="mt-2 text-sm text-slate-500">
                  Shipping from {vendorName}: {formatCurrency(getShippingForVendor(vid)[0]?.priceCents ?? 0)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <Label htmlFor="coupon">Coupon code</Label>
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
          <dt>Shipping (est.)</dt>
          <dd>{formatCurrency(shippingTotal)}</dd>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <dt>Total</dt>
          <dd>{formatCurrency(subtotal + shippingTotal)}</dd>
        </div>
      </dl>

      <Button asChild className="mt-6 w-full" size="lg">
        <Link href="/checkout">Proceed to checkout</Link>
      </Button>
    </div>
  );
}
