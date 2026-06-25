"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HubShell } from "@/components/hub-shell";
import {
  shopifyIntegrationGuide,
  woocommerceIntegrationGuide,
} from "@/lib/integration-guides";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, SetupGuide } from "@fosl/ui";

type Platform = "shopify" | "woocommerce" | null;

export default function ConnectIntegrationPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>(null);
  const [syncShipping, setSyncShipping] = useState(true);
  const [storeUrl, setStoreUrl] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect() {
    if (!platform || !storeUrl.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          storeUrl: storeUrl.trim(),
          syncShipping,
          accessToken: platform === "shopify" ? "demo" : undefined,
          consumerKey: platform === "woocommerce" ? consumerKey || "demo" : undefined,
          consumerSecret: platform === "woocommerce" ? consumerSecret || "demo" : undefined,
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Connect failed.");
      router.push("/vendor/integrations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connect failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!platform) {
    return (
      <HubShell>
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Connect your store</h1>
            <p className="text-slate-600">Choose your e-commerce platform</p>
          </div>

          <SetupGuide
            title="Before you connect"
            steps={[
              {
                title: "Pick the platform you already use",
                body: "Shopify stores use OAuth and the Admin API. WooCommerce stores use REST API keys from WordPress admin.",
              },
              {
                title: "Gather credentials first",
                body: "You’ll need API access from the platform admin before FOSL can sync products and shipping.",
              },
              {
                title: "One connection per platform",
                body: "Each vendor can link one Shopify store and one WooCommerce store. Use native catalog if you sell only on FOSL.",
              },
            ]}
            terms={[
              {
                term: "Sync",
                definition: "FOSL copies products, inventory, and shipping rates into your vendor catalog on a schedule.",
              },
              {
                term: "Order push-back",
                definition: "After checkout, line items can be sent back to your connected store for fulfillment (when configured).",
              },
            ]}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setPlatform("shopify")}
              className="rounded-lg border-2 border-slate-200 p-6 text-left transition-colors hover:border-primary hover:bg-blue-50"
            >
              <p className="text-lg font-semibold">Shopify</p>
              <p className="mt-2 text-sm text-slate-500">
                Admin API + OAuth. Best for Shopify-hosted catalogs and shipping zones.
              </p>
            </button>
            <button
              onClick={() => setPlatform("woocommerce")}
              className="rounded-lg border-2 border-slate-200 p-6 text-left transition-colors hover:border-primary hover:bg-blue-50"
            >
              <p className="text-lg font-semibold">WooCommerce</p>
              <p className="mt-2 text-sm text-slate-500">
                REST API keys from WordPress. Best for self-hosted WooCommerce shops.
              </p>
            </button>
          </div>
          <Button variant="outline" asChild>
            <Link href="/vendor/integrations">Back</Link>
          </Button>
        </div>
      </HubShell>
    );
  }

  const guide = platform === "shopify" ? shopifyIntegrationGuide : woocommerceIntegrationGuide;

  return (
    <HubShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Connect {platform}</h1>
          <p className="text-slate-600">Enter credentials and sync preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Store credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="storeUrl">Store URL *</Label>
                  <Input
                    id="storeUrl"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    placeholder={
                      platform === "shopify" ? "your-store.myshopify.com" : "shop.example.com"
                    }
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {platform === "shopify"
                      ? "Use your *.myshopify.com admin hostname, not a custom domain."
                      : "Public WordPress URL where WooCommerce is installed (HTTPS recommended)."}
                  </p>
                </div>
                {platform === "woocommerce" && (
                  <>
                    <div>
                      <Label htmlFor="consumerKey">Consumer key *</Label>
                      <Input
                        id="consumerKey"
                        value={consumerKey}
                        onChange={(e) => setConsumerKey(e.target.value)}
                        placeholder="ck_…"
                        className="mt-1"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        From WooCommerce → Settings → Advanced → REST API.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="consumerSecret">Consumer secret *</Label>
                      <Input
                        id="consumerSecret"
                        type="password"
                        value={consumerSecret}
                        onChange={(e) => setConsumerSecret(e.target.value)}
                        placeholder="cs_…"
                        className="mt-1"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Shown only once when the key is created. Regenerate if lost.
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="syncInterval">Sync interval (minutes)</Label>
                  <Input id="syncInterval" type="number" defaultValue={15} min={15} className="mt-1" />
                  <p className="mt-1 text-xs text-slate-500">
                    Minimum 15 minutes. FOSL also supports manual Sync now from the integrations list.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={syncShipping}
                    onChange={(e) => setSyncShipping(e.target.checked)}
                  />
                  Sync shipping zones and rates (recommended)
                </label>
                <p className="text-xs text-slate-500">
                  Imports regional shipping methods so storefront checkout can quote the same options as
                  your {platform === "shopify" ? "Shopify" : "WooCommerce"} store.
                </p>
              </CardContent>
            </Card>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              {platform === "shopify" ? (
                <Button disabled={submitting || !storeUrl.trim()} onClick={() => void handleConnect()}>
                  {submitting ? "Connecting…" : "Connect with Shopify OAuth"}
                </Button>
              ) : (
                <Button disabled={submitting || !storeUrl.trim()} onClick={() => void handleConnect()}>
                  {submitting ? "Saving…" : "Save and run first sync"}
                </Button>
              )}
              <Button variant="outline" onClick={() => setPlatform(null)}>
                Back
              </Button>
            </div>
          </div>

          <SetupGuide
            className="lg:col-span-2"
            title={guide.title}
            steps={guide.steps}
            terms={guide.terms}
            note={guide.note}
          />
        </div>
      </div>
    </HubShell>
  );
}
