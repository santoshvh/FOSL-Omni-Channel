"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { AlertBanner, Button } from "@fosl/ui";
import { usePlatformConfig } from "@/lib/use-platform-config";

type PaymentIntentResponse = {
  mode: "mock" | "stripe";
  clientSecret?: string | null;
  paymentIntentId: string;
  settlement?: "destination" | "platform";
};

type CheckoutPaymentProps = {
  totalCents: number;
  email: string;
  termsAccepted: boolean;
  lines: { productId: string; quantity: number }[];
  onSuccess: (paymentIntentId: string) => Promise<void>;
  onBack: () => void;
};

function MockPaymentForm({
  onSuccess,
  onBack,
  paymentIntentId,
  termsAccepted,
  totalLabel,
}: {
  onSuccess: (paymentIntentId: string) => Promise<void>;
  onBack: () => void;
  paymentIntentId: string;
  termsAccepted: boolean;
  totalLabel: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!termsAccepted) {
      setError("Please accept the Terms and Privacy Policy.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSuccess(paymentIntentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6">
        <p className="font-medium">Stripe Payment Element</p>
        <p className="mt-1 text-xs text-amber-700">
          Test mode — add STRIPE_SECRET_KEY to `.env` for live Payment Element.
        </p>
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
      </div>
      {error && (
        <AlertBanner variant="error" title="Payment failed">
          {error}
        </AlertBanner>
      )}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={onBack} disabled={submitting}>
          Back
        </Button>
        <Button onClick={handlePay} disabled={submitting || !termsAccepted}>
          {submitting ? "Processing…" : `Pay ${totalLabel}`}
        </Button>
      </div>
    </div>
  );
}

function StripePaymentForm({
  onSuccess,
  onBack,
  termsAccepted,
  totalLabel,
}: {
  onSuccess: (paymentIntentId: string) => Promise<void>;
  onBack: () => void;
  termsAccepted: boolean;
  totalLabel: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!termsAccepted) {
      setError("Please accept the Terms and Privacy Policy.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message ?? "Payment failed.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      await onSuccess(paymentIntent.id);
      return;
    }

    setError("Payment was not completed.");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      {error && (
        <AlertBanner variant="error" title="Payment failed">
          {error}
        </AlertBanner>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={onBack} disabled={submitting}>
          Back
        </Button>
        <Button type="submit" disabled={submitting || !stripe || !termsAccepted}>
          {submitting ? "Processing…" : `Pay ${totalLabel}`}
        </Button>
      </div>
    </form>
  );
}

export function CheckoutPayment({
  totalCents,
  email,
  termsAccepted,
  lines,
  onSuccess,
  onBack,
}: CheckoutPaymentProps) {
  const { config } = usePlatformConfig();
  const publishableKey =
    config?.stripePublishableKey?.trim() ??
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<PaymentIntentResponse | null>(null);
  const totalLabel = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalCents / 100);

  const linesKey = lines.map((line) => `${line.productId}:${line.quantity}`).join("|");

  useEffect(() => {
    let cancelled = false;

    async function loadIntent() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v1/checkout/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amountCents: totalCents, email, lines }),
        });
        const json = (await res.json()) as { data?: PaymentIntentResponse; error?: string };
        if (!res.ok) throw new Error(json.error ?? "Unable to start payment.");
        if (!cancelled && json.data) setIntent(json.data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to start payment.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadIntent();
    return () => {
      cancelled = true;
    };
  }, [totalCents, email, linesKey]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading secure payment…</p>;
  }

  if (error || !intent) {
    return (
      <AlertBanner variant="error" title="Payment unavailable">
        {error ?? "Unable to initialize payment."}
      </AlertBanner>
    );
  }

  if (intent.mode === "mock" || !intent.clientSecret || !publishableKey) {
    return (
      <MockPaymentForm
        onSuccess={onSuccess}
        onBack={onBack}
        paymentIntentId={intent.paymentIntentId}
        termsAccepted={termsAccepted}
        totalLabel={totalLabel}
      />
    );
  }

  const stripePromise = loadStripe(publishableKey);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: intent.clientSecret,
        appearance: { theme: "stripe" },
      }}
    >
      <StripePaymentForm
        onSuccess={onSuccess}
        onBack={onBack}
        termsAccepted={termsAccepted}
        totalLabel={totalLabel}
      />
    </Elements>
  );
}
