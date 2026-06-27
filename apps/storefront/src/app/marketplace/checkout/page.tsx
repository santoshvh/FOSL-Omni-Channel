"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Label,
  ShippingMethodSelector,
  AlertBanner,
  formatCurrency,
} from "@fosl/ui";
import { useCart } from "@/lib/cart-context";
import { CheckoutStepSkeleton } from "@/components/checkout-step-skeleton";
import { CheckoutPayment } from "@/components/checkout-payment";
import { setStoredOrderEmail } from "@/lib/order-email";
import { useVendorsShipping } from "@/lib/use-vendor-shipping";

const steps = ["Contact", "Shipping", "Payment"] as const;

type FormData = {
  email: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal: string;
  country: string;
};

const initialForm: FormData = {
  email: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal: "",
  country: "US",
};

export default function MarketplaceCheckoutPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { lines, subtotalCents, isHydrated } = useCart();
  const [form, setForm] = useState<FormData>(initialForm);

  const physicalVendorIds = useMemo(
    () => [...new Set(lines.filter((l) => l.product.type === "physical").map((l) => l.product.vendorId))],
    [lines]
  );
  const shippingByVendor = useVendorsShipping(physicalVendorIds);
  const vendorNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const line of lines) {
      if (line.product.type === "physical") {
        map[line.product.vendorId] = line.product.vendorName;
      }
    }
    return map;
  }, [lines]);
  const [shippingSelections, setShippingSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    setShippingSelections((prev) => {
      const next = { ...prev };
      for (const vendorId of physicalVendorIds) {
        const methods = shippingByVendor[vendorId];
        if (methods?.length && !next[vendorId]) {
          next[vendorId] = methods[0]!.id;
        }
      }
      return next;
    });
  }, [physicalVendorIds, shippingByVendor]);

  const subtotal = subtotalCents;
  const shipping = physicalVendorIds.reduce((s, vid) => {
    const methods = shippingByVendor[vid] ?? [];
    return s + (methods.find((m) => m.id === shippingSelections[vid])?.priceCents ?? methods[0]?.priceCents ?? 0);
  }, 0);
  const tax = Math.round((subtotal + shipping) * 0.08);
  const total = subtotal + shipping + tax;

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function completeOrder(paymentIntentId: string) {
    setPayError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          stripePaymentIntentId: paymentIntentId,
          lines: lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            shippingMethodId:
              line.product.type === "physical"
                ? shippingSelections[line.product.vendorId]
                : undefined,
          })),
          shippingCents: shipping,
          taxCents: tax,
          shipping: {
            fullName: form.name.trim(),
            line1: form.line1.trim(),
            line2: form.line2.trim() || undefined,
            city: form.city.trim(),
            state: form.state.trim(),
            postalCode: form.postal.trim(),
            country: form.country.trim(),
          },
        }),
      });
      const json = (await res.json()) as { data?: { id: string }; error?: string };
      if (!res.ok) {
        throw new Error(json.error ?? "Payment could not be completed.");
      }
      const orderId = json.data?.id ?? "unknown";
      setStoredOrderEmail(form.email.trim());
      router.push(
        `/marketplace/checkout/confirmation?orderId=${encodeURIComponent(orderId)}`
      );
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Payment could not be completed.");
      setSubmitting(false);
      throw err;
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/marketplace/cart" className="text-sm text-primary-dark hover:underline">
        ← Cart
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Marketplace checkout</h1>
      <p className="text-slate-600">Unified master order · {physicalVendorIds.length} vendors</p>

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
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => {
                    if (form.email.trim()) setStep(1);
                  }}
                >
                  Continue to shipping
                </Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6 rounded-lg border border-slate-200 p-6">
                <div className="space-y-4">
                  <h2 className="font-semibold">Shipping address</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="name">Full name *</Label>
                      <Input
                        id="name"
                        className="mt-1"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="line1">Address *</Label>
                      <Input
                        id="line1"
                        className="mt-1"
                        value={form.line1}
                        onChange={(e) => update("line1", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        className="mt-1"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal">Postal code *</Label>
                      <Input
                        id="postal"
                        className="mt-1"
                        value={form.postal}
                        onChange={(e) => update("postal", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {physicalVendorIds.map((vendorId) => {
                  const methods = shippingByVendor[vendorId] ?? [];
                  if (methods.length === 0) return null;
                  return (
                    <ShippingMethodSelector
                      key={vendorId}
                      vendorName={vendorNames[vendorId] ?? "Vendor"}
                      methods={methods}
                      selectedId={shippingSelections[vendorId] ?? methods[0]!.id}
                      onSelect={(id) => setShippingSelections((s) => ({ ...s, [vendorId]: id }))}
                    />
                  );
                })}

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
                    <dt>Tax</dt>
                    <dd>{formatCurrency(tax)}</dd>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-base font-bold">
                    <dt>Total</dt>
                    <dd>{formatCurrency(total)}</dd>
                  </div>
                </dl>
                <label className="flex items-start gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
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
                {payError && (
                  <AlertBanner variant="error" title="Checkout failed">
                    {payError}
                  </AlertBanner>
                )}
                <CheckoutPayment
                  totalCents={total}
                  email={form.email.trim()}
                  termsAccepted={termsAccepted}
                  lines={lines.map((line) => ({
                    productId: line.productId,
                    quantity: line.quantity,
                  }))}
                  onSuccess={completeOrder}
                  onBack={() => setStep(1)}
                />
                {submitting ? (
                  <p className="text-sm text-slate-500">Finalizing your order…</p>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
