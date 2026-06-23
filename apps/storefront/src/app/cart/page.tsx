"use client";

import Link from "next/link";
import { getShippingForVendor } from "@fosl/mocks";
import { Button, formatCurrency, Input, Label } from "@fosl/ui";
import { CartLineItem } from "@/components/cart-line-item";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
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

  const vendorIds = [...new Set(lines.filter((l) => l.product.type === "physical").map((l) => l.product.vendorId))];
  const shippingTotal = vendorIds.reduce((s, vid) => {
    const methods = getShippingForVendor(vid);
    return s + (methods[0]?.priceCents ?? 0);
  }, 0);

  const groups = lines.reduce<Record<string, typeof lines>>((acc, line) => {
    const key = line.product.vendorId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(line);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">Your cart</h1>
      <p className="text-slate-600">Update quantities, remove items, or save for later</p>

      {lines.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-200 p-8 text-center">
          <p className="text-slate-600">Your cart is empty.</p>
          <Button asChild className="mt-4">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {Object.entries(groups).map(([vid, vendorLines]) => {
            const vendorName = vendorLines[0]?.product.vendorName;
            return (
              <div key={vid} className="rounded-lg border border-slate-200 p-4">
                <h2 className="font-semibold text-slate-700">{vendorName}</h2>
                <ul className="mt-3 divide-y">
                  {vendorLines.map((line) => (
                    <CartLineItem
                      key={line.productId}
                      line={line}
                      layout="full"
                      maxQuantity={maxQuantity(line.product)}
                      productHref={`/products/${line.productId}`}
                      onQuantityChange={(qty) => setQuantity(line.productId, qty)}
                      onRemove={() => removeItem(line.productId)}
                      onSaveForLater={() => saveForLater(line.productId)}
                    />
                  ))}
                </ul>
                {vendorLines.some((l) => l.product.type === "physical") && (
                  <p className="mt-2 text-sm text-slate-500">
                    Shipping from {vendorName}: {formatCurrency(getShippingForVendor(vid)[0]?.priceCents ?? 0)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {savedLines.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold">Saved for later</h2>
          <p className="text-sm text-slate-500">Items you moved out of the cart — move back when ready</p>
          <ul className="mt-4 divide-y rounded-lg border border-slate-200 px-4">
            {savedLines.map((line) => (
              <CartLineItem
                key={line.productId}
                line={line}
                layout="full"
                maxQuantity={maxQuantity(line.product)}
                productHref={`/products/${line.productId}`}
                onQuantityChange={(qty) => setSavedQuantity(line.productId, qty)}
                onRemove={() => removeSaved(line.productId)}
                onMoveToCart={() => moveToCart(line.productId)}
              />
            ))}
          </ul>
        </div>
      )}

      {lines.length > 0 && (
        <>
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
              <dd>{formatCurrency(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <dt>Shipping (est.)</dt>
              <dd>{formatCurrency(shippingTotal)}</dd>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <dt>Total</dt>
              <dd>{formatCurrency(subtotalCents + shippingTotal)}</dd>
            </div>
          </dl>

          <Button asChild className="mt-6 w-full" size="lg">
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        </>
      )}
    </div>
  );
}
