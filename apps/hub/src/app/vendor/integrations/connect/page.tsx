"use client";

import { useState } from "react";
import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@fosl/ui";

type Platform = "shopify" | "woocommerce" | null;

export default function ConnectIntegrationPage() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [syncShipping, setSyncShipping] = useState(true);

  if (!platform) {
    return (
      <HubShell>
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Connect your store</h1>
            <p className="text-slate-600">Choose your e-commerce platform</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setPlatform("shopify")}
              className="rounded-lg border-2 border-slate-200 p-6 text-left transition-colors hover:border-primary hover:bg-blue-50"
            >
              <p className="text-lg font-semibold">Shopify</p>
              <p className="mt-2 text-sm text-slate-500">
                OAuth connect. Syncs products, inventory, and shipping zones via Admin API.
              </p>
            </button>
            <button
              onClick={() => setPlatform("woocommerce")}
              className="rounded-lg border-2 border-slate-200 p-6 text-left transition-colors hover:border-primary hover:bg-blue-50"
            >
              <p className="text-lg font-semibold">WooCommerce</p>
              <p className="mt-2 text-sm text-slate-500">
                REST API keys. Syncs products, stock, and shipping methods/zones.
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

  return (
    <HubShell>
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Connect {platform}</h1>
          <p className="text-slate-600">Enter credentials and sync preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Store credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeUrl">Store URL *</Label>
              <Input
                id="storeUrl"
                placeholder={
                  platform === "shopify"
                    ? "your-store.myshopify.com"
                    : "shop.example.com"
                }
                className="mt-1"
              />
            </div>
            {platform === "woocommerce" && (
              <>
                <div>
                  <Label htmlFor="consumerKey">Consumer key *</Label>
                  <Input id="consumerKey" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="consumerSecret">Consumer secret *</Label>
                  <Input id="consumerSecret" type="password" className="mt-1" />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="syncInterval">Sync interval (minutes)</Label>
              <Input id="syncInterval" type="number" defaultValue={15} min={15} className="mt-1" />
              <p className="mt-1 text-xs text-slate-500">Minimum 15 minutes per platform policy</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={syncShipping}
                onChange={(e) => setSyncShipping(e.target.checked)}
              />
              Sync shipping zones and rates (recommended)
            </label>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          {platform === "shopify" ? (
            <Button>Connect with Shopify OAuth</Button>
          ) : (
            <Button>Save and run first sync</Button>
          )}
          <Button variant="outline" onClick={() => setPlatform(null)}>
            Back
          </Button>
        </div>
      </div>
    </HubShell>
  );
}
