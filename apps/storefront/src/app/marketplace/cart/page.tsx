"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button, formatCurrency, Input, Label } from "@fosl/ui";
import { CartLineItem } from "@/components/cart-line-item";
import { useCart } from "@/lib/cart-context";
import { useVendorsShipping } from "@/lib/use-vendor-shipping";

export default function MarketplaceCartPage() {
  const {
    lines,
    savedLines,
    subtotalCents,
    setQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    removeSaved,
    setSavedQuantity,
    maxQuantity,
  } = useCart();

  const groups = lines.reduce<
    Record<string, { vendorName: string; operatorName: string; items: typeof lines }>
  >((acc, line) => {
    const key = line.product.vendorId;
    if (!acc[key]) {
      const operator = line.product.vendorId === "ven_4" ? "Urban Market" : "Demo Storefront";
      acc[key] = { vendorName: line.product.vendorName, operatorName: operator, items: [] };
    }
    acc[key].items.push(line);
    return acc;
  }, {});

  const physicalVendorIds = useMemo(
    () => [...new Set(lines.filter((l) => l.product.type === "physical").map((l) => l.product.vendorId))],
    [lines]
  );
  const shippingByVendor = useVendorsShipping(physicalVendorIds);
  const shippingTotal = physicalVendorIds.reduce((s, vid) => {
    const methods = shippingByVendor[vid] ?? [];
    return s + (methods[0]?.priceCents ?? 0);
  }, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Marketplace cart</h1>
      <p className="text-slate-600">
        Update quantities, remove items, or save for later — grouped by vendor
      </p>

      {lines.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-200 p-8 text-center">
          <p className="text-slate-600">Your marketplace cart is empty.</p>
          <Button asChild className="mt-4">
            <Link href="/marketplace">Browse marketplace</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {Object.entries(groups).map(([vid, group]) => (
            <div key={vid} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="font-semibold">{group.vendorName}</h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-primary-dark">
                  Fulfilled via {group.operatorName}
                </span>
              </div>
              <ul className="mt-3 divide-y">
                {group.items.map((line) => (
                  <CartLineItem
                    key={line.productId}
                    line={line}
                    layout="full"
                    maxQuantity={maxQuantity(line.product)}
                    productHref={`/marketplace/products/${line.productId}`}
                    onQuantityChange={(qty) => setQuantity(line.productId, qty)}
                    onRemove={() => removeItem(line.productId)}
                    onSaveForLater={() => saveForLater(line.productId)}
                  />
                ))}
              </ul>
              {group.items.some((l) => l.product.type === "physical") && (
                <p className="mt-2 text-sm text-slate-500">
                  Shipping estimate:{" "}
                  {formatCurrency(shippingByVendor[vid]?.[0]?.priceCents ?? 0)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {savedLines.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold">Saved for later</h2>
          <ul className="mt-4 divide-y rounded-lg border border-slate-200 px-4">
            {savedLines.map((line) => (
              <CartLineItem
                key={line.productId}
                line={line}
                layout="full"
                maxQuantity={maxQuantity(line.product)}
                productHref={`/marketplace/products/${line.productId}`}
                onRemove={() => removeSaved(line.productId)}
                onMoveToCart={() => moveToCart(line.productId)}
                onQuantityChange={(qty) => setSavedQuantity(line.productId, qty)}
              />
            ))}
          </ul>
        </div>
      )}

      {lines.length > 0 && (
        <>
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
              <dd>{formatCurrency(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <dt>Shipping (per vendor)</dt>
              <dd>{formatCurrency(shippingTotal)}</dd>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <dt>Total</dt>
              <dd>{formatCurrency(subtotalCents + shippingTotal)}</dd>
            </div>
          </dl>

          <Button asChild className="mt-6 w-full" size="lg">
            <Link href="/marketplace/checkout">Proceed to unified checkout</Link>
          </Button>
        </>
      )}
    </div>
  );
}
