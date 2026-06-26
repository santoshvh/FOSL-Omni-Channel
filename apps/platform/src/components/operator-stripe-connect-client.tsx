"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, AlertBanner, StatCard } from "@fosl/ui";
import { Loader2, ExternalLink } from "lucide-react";
import { stripeConnectGuide } from "@/lib/integration-guides";

type ConnectStatus = {
  stripeConnectId: string | null;
  onboarded: boolean;
  paymentsModel: string;
};

export function OperatorStripeConnectClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/operator/stripe-connect");
      const json = (await res.json()) as { data?: ConnectStatus; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to load Connect status.");
      setStatus(json.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Connect status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function startOnboarding() {
    setStarting(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/operator/stripe-connect", { method: "POST" });
      const json = (await res.json()) as { data?: { url: string }; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Unable to start onboarding.");
      if (json.data?.url) window.location.href = json.data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start onboarding.");
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading Stripe Connect…
      </div>
    );
  }

  const connected = Boolean(status?.stripeConnectId && status.onboarded);
  const stripeBanner = searchParams.get("stripe");

  return (
    <div className="space-y-6">
      {stripeBanner === "connected" && (
        <AlertBanner variant="success" title="Stripe Connect onboarding submitted">{null}</AlertBanner>
      )}
      {error && <AlertBanner variant="error" title={error}>{null}</AlertBanner>}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Payments model"
          value={status?.paymentsModel === "operator_connect" ? "Operator MoR" : "Platform MoR"}
          hint="Checkout routing"
        />
        <StatCard
          label="Connect status"
          value={connected ? "Active" : status?.stripeConnectId ? "Pending" : "Not started"}
        />
        <StatCard
          label="Platform fee"
          value="10%"
          hint="Application fee to FOSL on operator charges"
        />
      </div>

      <p className="text-sm text-slate-600">
        With Operator Connect, your storefront is merchant of record. FOSL collects a platform fee;
        vendor and creator shares are transferred after each successful payment.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={() => void startOnboarding()} disabled={starting}>
          {starting ? "Redirecting…" : connected ? "Update Stripe Express" : "Connect Stripe Express"}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">{stripeConnectGuide.title}</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {stripeConnectGuide.steps.map((step) => (
            <li key={step.title}>
              <p className="font-medium text-slate-800">{step.title}</p>
              <p className="mt-1">{step.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
