"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Input, Label, AlertBanner } from "@fosl/ui";
import { Loader2 } from "lucide-react";

type StorefrontRow = {
  id: string;
  name: string;
  path: string;
  customDomain: string | null;
  allowedOrigins: string[] | null;
};

export function OperatorDomainsClient() {
  const [storefronts, setStorefronts] = useState<StorefrontRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { domain: string; origins: string }>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/operator/storefronts");
      const json = (await res.json()) as { data?: StorefrontRow[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to load storefronts.");
      const rows = json.data ?? [];
      setStorefronts(rows);
      setDrafts(
        Object.fromEntries(
          rows.map((sf) => [
            sf.id,
            {
              domain: sf.customDomain ?? "",
              origins: (sf.allowedOrigins ?? []).join("\n"),
            },
          ])
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveStorefront(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    setSaving(id);
    setError(null);
    try {
      const allowedOrigins = draft.origins
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const res = await fetch(`/api/v1/operator/storefronts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customDomain: draft.domain.trim() || null,
          allowedOrigins,
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Save failed.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(null);
    }
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

      {storefronts.map((sf) => (
        <div key={sf.id} className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">{sf.name}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Default path: <code className="text-xs">/{sf.path}</code>
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor={`domain-${sf.id}`}>Custom domain</Label>
              <Input
                id={`domain-${sf.id}`}
                className="mt-1"
                placeholder="shop.example.com"
                value={drafts[sf.id]?.domain ?? ""}
                onChange={(e) =>
                  setDrafts((d) => ({
                    ...d,
                    [sf.id]: { ...d[sf.id]!, domain: e.target.value },
                  }))
                }
              />
              <p className="mt-2 text-xs text-slate-500">
                DNS: CNAME <code>{drafts[sf.id]?.domain || "shop.example.com"}</code> →{" "}
                <code>shop.foslone.com</code> (or your storefront host). Set{" "}
                <code>FOSL_INTERNAL_SECRET</code> on the server for custom-domain rewrites.
              </p>
            </div>
            <div>
              <Label htmlFor={`origins-${sf.id}`}>CORS allowed origins (one per line)</Label>
              <textarea
                id={`origins-${sf.id}`}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                rows={3}
                placeholder="https://shop.example.com"
                value={drafts[sf.id]?.origins ?? ""}
                onChange={(e) =>
                  setDrafts((d) => ({
                    ...d,
                    [sf.id]: { ...d[sf.id]!, origins: e.target.value },
                  }))
                }
              />
            </div>
            <Button type="button" size="sm" disabled={saving === sf.id} onClick={() => void saveStorefront(sf.id)}>
              {saving === sf.id ? "Saving…" : "Save domain settings"}
            </Button>
          </div>
        </div>
      ))}

      <p className="text-sm text-slate-500">
        Manage API keys on{" "}
        <Link href="/operator/storefront" className="text-primary-dark hover:underline">
          Storefronts & API keys
        </Link>
        .
      </p>
    </div>
  );
}
