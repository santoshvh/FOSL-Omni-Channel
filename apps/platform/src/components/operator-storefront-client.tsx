"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, AlertBanner } from "@fosl/ui";
import { Copy, Check, Loader2, RefreshCw } from "lucide-react";

type StorefrontRow = {
  id: string;
  name: string;
  path: string;
  customDomain: string | null;
  isDefault: boolean;
  publishableKey: string | null;
  allowedOrigins: string[] | null;
  payments: {
    model: string;
    stripeConnectConfigured: boolean;
  };
};

export function OperatorStorefrontClient() {
  const [storefronts, setStorefronts] = useState<StorefrontRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", path: "", customDomain: "" });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/operator/storefronts");
      const json = (await res.json()) as { data?: StorefrontRow[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to load storefronts.");
      setStorefronts(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load storefronts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createStorefront() {
    setCreating(true);
    setError(null);
    setNewSecret(null);
    try {
      const res = await fetch("/api/v1/operator/storefronts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          path: form.path.trim().toLowerCase(),
          customDomain: form.customDomain.trim() || null,
        }),
      });
      const json = (await res.json()) as {
        data?: { secretKey: string };
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Create failed.");
      setNewSecret(json.data?.secretKey ?? null);
      setForm({ name: "", path: "", customDomain: "" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed.");
    } finally {
      setCreating(false);
    }
  }

  async function rotateKeys(id: string) {
    setError(null);
    setNewSecret(null);
    try {
      const res = await fetch(`/api/v1/operator/storefronts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rotateKeys: true }),
      });
      const json = (await res.json()) as { data?: { secretKey: string }; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Rotate failed.");
      setNewSecret(json.data?.secretKey ?? null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rotate failed.");
    }
  }

  function copyText(label: string, text: string) {
    void navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading storefronts…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <AlertBanner variant="error" title={error}>{null}</AlertBanner>}
      {newSecret && (
        <AlertBanner variant="warning" title="Save this secret key — it is shown only once">
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="rounded bg-white/80 px-2 py-1 text-xs">{newSecret}</code>
            <Button type="button" size="sm" variant="outline" onClick={() => copyText("secret", newSecret)}>
              {copied === "secret" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </AlertBanner>
      )}

      <div className="grid gap-4">
        {storefronts.map((sf) => (
          <Card key={sf.id}>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                <span>{sf.name}</span>
                <span className="text-sm font-normal text-slate-500">
                  {sf.payments.stripeConnectConfigured ? "Operator Connect" : "Platform payments"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="font-medium">Path:</span> /{sf.path}
              </p>
              {sf.customDomain && (
                <p>
                  <span className="font-medium">Domain:</span> {sf.customDomain}
                </p>
              )}
              {sf.publishableKey && (
                <div>
                  <p className="font-medium">Publishable key</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <code className="rounded bg-slate-100 px-2 py-1 text-xs">{sf.publishableKey}</code>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => copyText(sf.id, sf.publishableKey!)}
                    >
                      {copied === sf.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-slate-500">
                Self-hosted shops: set <code className="text-xs">FOSL_PUBLISHABLE_KEY</code> and call{" "}
                <code className="text-xs">GET /api/v1/products?scope=operator</code> with{" "}
                <code className="text-xs">Authorization: Bearer pk_sf_…</code>
              </p>
              <Button type="button" size="sm" variant="outline" onClick={() => void rotateKeys(sf.id)}>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Rotate API keys
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add storefront</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sf-name">Name</Label>
            <Input
              id="sf-name"
              className="mt-1"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="sf-path">URL path</Label>
            <Input
              id="sf-path"
              className="mt-1 font-mono"
              placeholder="urban-east"
              value={form.path}
              onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="sf-domain">Custom domain (optional)</Label>
            <Input
              id="sf-domain"
              className="mt-1"
              placeholder="shop.example.com"
              value={form.customDomain}
              onChange={(e) => setForm((f) => ({ ...f, customDomain: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" disabled={creating || !form.name.trim() || !form.path.trim()} onClick={() => void createStorefront()}>
              {creating ? "Creating…" : "Create storefront"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/operator/domains">Domain DNS guide</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
