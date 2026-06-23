"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Label, ShippingMethodSelector, AlertBanner } from "@fosl/ui";
import { formatCurrency } from "@fosl/ui";
import { getShippingForVendor } from "@fosl/mocks";
import { useCart } from "@/lib/cart-context";

const steps = ["Contact", "Shipping", "Payment"] as const;

type FormData = {
  email: string;
  marketing: boolean;
  guest: boolean;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  phone: string;
};

const initialForm: FormData = {
  email: "",
  marketing: false,
  guest: true,
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal: "",
  country: "US",
  phone: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const { lines, subtotalCents } = useCart();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const physicalVendorIds = [
    ...new Set(lines.filter((l) => l.product.type === "physical").map((l) => l.product.vendorId)),
  ];
  const [shippingSelections, setShippingSelections] = useState<Record<string, string>>({
    ven_1: "ship_1",
    ven_4: "ship_3",
  });

  const subtotal = subtotalCents;
  const shipping = physicalVendorIds.reduce((s, vid) => {
    return s + (getShippingForVendor(vid).find((m) => m.id === shippingSelections[vid])?.priceCents ?? 0);
  }, 0);
  const tax = Math.round((subtotal + shipping) * 0.08);
  const total = subtotal + shipping + tax;

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateContact() {
    const next: Partial<Record<keyof FormData, string>> = {};
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateShipping() {
    const next: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!form.line1.trim()) next.line1 = "Street address is required.";
    if (!form.city.trim()) next.city = "City is required.";
    if (!form.postal.trim()) next.postal = "Postal code is required.";
    if (!form.country.trim()) next.country = "Country is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-1 text-sm text-slate-500">Secure checkout · Stripe test mode</p>

      <ol className="mt-6 flex gap-2">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`flex-1 rounded-md py-2 text-center text-sm font-medium ${
              i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary-muted text-ink" : "bg-slate-100 text-slate-500"
            }`}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-6">
        {step === 0 && (
          <div className="space-y-4 rounded-lg border border-slate-200 p-6">
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Checkout as</legend>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={form.guest}
                  onChange={() => update("guest", true)}
                />
                Guest checkout
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={!form.guest}
                  onChange={() => update("guest", false)}
                />
                Sign in to saved addresses
              </label>
            </fieldset>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={!!errors.email}
              />
              <FieldError message={errors.email} />
              <p className="mt-1 text-xs text-slate-500">Order confirmation and digital downloads sent here.</p>
            </div>
            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 555 0100"
                className="mt-1"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.marketing}
                onChange={(e) => update("marketing", e.target.checked)}
              />
              Send me product updates and offers
            </label>
            <Button
              onClick={() => {
                if (validateContact()) setStep(1);
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
                    aria-invalid={!!errors.name}
                  />
                  <FieldError message={errors.name} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="line1">Address line 1 *</Label>
                  <Input
                    id="line1"
                    placeholder="123 Main St"
                    className="mt-1"
                    value={form.line1}
                    onChange={(e) => update("line1", e.target.value)}
                    aria-invalid={!!errors.line1}
                  />
                  <FieldError message={errors.line1} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="line2">Address line 2</Label>
                  <Input
                    id="line2"
                    placeholder="Apt, suite, unit"
                    className="mt-1"
                    value={form.line2}
                    onChange={(e) => update("line2", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    className="mt-1"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    aria-invalid={!!errors.city}
                  />
                  <FieldError message={errors.city} />
                </div>
                <div>
                  <Label htmlFor="state">State / Province</Label>
                  <Input
                    id="state"
                    className="mt-1"
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="postal">Postal code *</Label>
                  <Input
                    id="postal"
                    className="mt-1"
                    value={form.postal}
                    onChange={(e) => update("postal", e.target.value)}
                    aria-invalid={!!errors.postal}
                  />
                  <FieldError message={errors.postal} />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <select
                    id="country"
                    className="mt-1 flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                  </select>
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
            <AlertBanner variant="info">
              Digital items in your order skip shipping and deliver instantly after payment.
            </AlertBanner>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button
                onClick={() => {
                  if (validateShipping()) setStep(2);
                }}
              >
                Continue to payment
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 rounded-lg border border-slate-200 p-6">
            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6">
              <p className="font-medium">Stripe Payment Element</p>
              <div className="mt-4 space-y-3">
                <div className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">
                  4242 4242 4242 4242
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">
                    MM / YY
                  </div>
                  <div className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">
                    CVC
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
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
            <p className="text-xs text-slate-500">
              Shipping to {form.name || "—"}, {form.city || "—"} {form.postal || "—"}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button asChild>
                <Link href="/checkout/confirmation?type=mixed">Pay {formatCurrency(total)}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
