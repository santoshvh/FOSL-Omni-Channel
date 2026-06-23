"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Label, ShippingMethodSelector } from "@fosl/ui";
import { formatCurrency } from "@fosl/ui";
import { getShippingForVendor } from "@fosl/mocks";

const steps = ["Contact", "Shipping", "Payment"] as const;

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [shippingSelections, setShippingSelections] = useState<Record<string, string>>({
    ven_1: "ship_1",
    ven_4: "ship_3",
  });

  const subtotal = 11498;
  const shipping =
    (getShippingForVendor("ven_1").find((m) => m.id === shippingSelections.ven_1)?.priceCents ?? 0) +
    (getShippingForVendor("ven_4").find((m) => m.id === shippingSelections.ven_4)?.priceCents ?? 0);
  const tax = Math.round((subtotal + shipping) * 0.08);
  const total = subtotal + shipping + tax;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <ol className="mt-6 flex gap-2">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`flex-1 rounded-md py-2 text-center text-sm font-medium ${
              i === step ? "bg-[#2E75B6] text-white" : i < step ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-500"
            }`}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-6">
        {step === 0 && (
          <div className="space-y-4 rounded-lg border border-slate-200 p-6">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              Send me updates and offers
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
            <ShippingMethodSelector
              vendorName="Acme Audio Co."
              methods={getShippingForVendor("ven_1")}
              selectedId={shippingSelections.ven_1}
              onSelect={(id) => setShippingSelections((s) => ({ ...s, ven_1: id }))}
            />
            <ShippingMethodSelector
              vendorName="Bright Labs"
              methods={getShippingForVendor("ven_4")}
              selectedId={shippingSelections.ven_4}
              onSelect={(id) => setShippingSelections((s) => ({ ...s, ven_4: id }))}
            />
            <p className="text-xs text-slate-500">Digital items skip shipping and deliver instantly after payment.</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Continue to payment</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 rounded-lg border border-slate-200 p-6">
            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="font-medium">Stripe Payment Element</p>
              <p className="mt-2 text-sm text-slate-500">
                Card · Apple Pay · Google Pay (test mode appearance)
              </p>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
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
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button asChild>
                <Link href="/checkout/confirmation?type=mixed">Pay {formatCurrency(total)}</Link>
              </Button>
            </div>
            <p className="text-center text-xs text-slate-400">
              Demo:{" "}
              <Link href="/checkout/confirmation?type=physical" className="underline">physical</Link>
              {" · "}
              <Link href="/checkout/confirmation?type=digital" className="underline">digital</Link>
              {" · "}
              <Link href="/checkout/confirmation?type=lead_gen" className="underline">lead gen</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
