"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Input, Label, ShippingMethodSelector, formatCurrency } from "@fosl/ui";
import { getShippingForVendor } from "@fosl/mocks";
import { useCart } from "@/lib/cart-context";
import { CheckoutStepSkeleton } from "@/components/checkout-step-skeleton";

const steps = ["Contact", "Shipping", "Payment"] as const;

export default function MarketplaceCheckoutPage() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const { lines, subtotalCents, isHydrated } = useCart();
  const subtotal = subtotalCents;

  const physicalVendors = [
    ...new Set(lines.filter((l) => l.product.type === "physical").map((l) => l.product.vendorId)),
  ];

  const [shippingSelections, setShippingSelections] = useState<Record<string, string>>({
    ven_1: "ship_1",
    ven_4: "ship_3",
  });

  useEffect(() => {
    setReady(true);
  }, []);

  const shipping = physicalVendors.reduce((s, vid) => {
    const methods = getShippingForVendor(vid);
    const selected = methods.find((m) => m.id === shippingSelections[vid]);
    return s + (selected?.priceCents ?? methods[0]?.priceCents ?? 0);
  }, 0);

  const tax = Math.round((subtotal + shipping) * 0.08);
  const total = subtotal + shipping + tax;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/marketplace/cart" className="text-sm text-primary-dark hover:underline">
        ← Cart
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Marketplace checkout</h1>
      <p className="text-slate-600">Unified master order · {physicalVendors.length} vendors</p>

      <ol className="mt-6 flex gap-2">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`flex-1 rounded-md py-2 text-center text-sm font-medium ${
              i === step
                ? "bg-primary text-primary-foreground"
                : i < step
                  ? "bg-primary-muted text-ink"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-6">
        {!ready || !isHydrated ? (
          <CheckoutStepSkeleton />
        ) : (
          <>
        {step === 0 && (
          <div className="space-y-4 rounded-lg border border-slate-200 p-6">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              Create FOSL account for cross-storefront order tracking
            </label>
            <Button onClick={() => setStep(1)}>Continue to shipping</Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 rounded-lg border border-slate-200 p-6">
            <div className="space-y-4">
              <h2 className="font-semibold">Shipping address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Full name *</Label>
                  <Input id="name" className="mt-1" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="line1">Address *</Label>
                  <Input id="line1" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="postal">Postal code *</Label>
                  <Input id="postal" className="mt-1" />
                </div>
              </div>
            </div>

            {physicalVendors.includes("ven_1") && (
              <ShippingMethodSelector
                vendorName="Acme Audio Co. (Demo Storefront)"
                methods={getShippingForVendor("ven_1")}
                selectedId={shippingSelections.ven_1}
                onSelect={(id) => setShippingSelections((s) => ({ ...s, ven_1: id }))}
              />
            )}
            {physicalVendors.includes("ven_4") && (
              <ShippingMethodSelector
                vendorName="Bright Labs (Urban Market)"
                methods={getShippingForVendor("ven_4")}
                selectedId={shippingSelections.ven_4}
                onSelect={(id) => setShippingSelections((s) => ({ ...s, ven_4: id }))}
              />
            )}

            <p className="text-xs text-slate-500">
              Digital items from Creator Academy deliver instantly after payment.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={() => setStep(2)}>Continue to payment</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 rounded-lg border border-slate-200 p-6">
            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="font-medium">Stripe Payment Element</p>
              <p className="mt-2 text-sm text-slate-500">
                Single charge · split payouts to vendors, creators, and operators
              </p>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping (multi-vendor)</dt>
                <dd>{formatCurrency(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax (Stripe Tax)</dt>
                <dd>{formatCurrency(tax)}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-bold">
                <dt>Total</dt>
                <dd>{formatCurrency(total)}</dd>
              </div>
            </dl>
            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input type="checkbox" className="mt-1" required />
              <span>
                I agree to the{" "}
                <Link href="/legal/terms" className="font-medium text-ink underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="font-medium text-ink underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button asChild>
                <Link href="/marketplace/checkout/confirmation">Pay {formatCurrency(total)}</Link>
              </Button>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
