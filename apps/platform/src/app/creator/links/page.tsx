"use client";

import { useEffect, useState } from "react";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label, ProductTypeBadge } from "@fosl/ui";
import type { Product } from "@fosl/contracts";
import { Copy, Check } from "lucide-react";

type CreatorLinkRow = {
  id: string;
  slug: string;
  label?: string | null;
  clickCount: number;
  product?: { id: string; title: string; type: Product["type"]; vendor?: { name: string } } | null;
};

type LinksResponse = {
  data?: CreatorLinkRow[];
  profile?: { referralCode: string; displayName?: string | null };
};

export default function CreatorLinksPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [links, setLinks] = useState<CreatorLinkRow[]>([]);
  const [referralCode, setReferralCode] = useState("CREATOR");
  const [selectedId, setSelectedId] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const storefrontBase = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? "http://localhost:3001";
  const selected = products.find((p) => p.id === selectedId);
  const link = selected
    ? `${storefrontBase}/marketplace/products/${selected.id}?ref=${referralCode}`
    : "";

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/v1/creator/links").then((r) => r.json() as Promise<LinksResponse>),
      fetch("/api/v1/network/products").then((r) => r.json() as Promise<{ data?: Product[] }>),
    ])
      .then(([linksJson, productsJson]) => {
        if (cancelled) return;
        const items = Array.isArray(productsJson.data) ? productsJson.data : [];
        setProducts(items);
        setLinks(Array.isArray(linksJson.data) ? linksJson.data : []);
        if (linksJson.profile?.referralCode) setReferralCode(linksJson.profile.referralCode);
        if (items[0]) setSelectedId(items[0].id);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function copyLink() {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Referral links</h1>
          <p className="text-slate-600">30-day last-click attribution · domain-scoped cookie</p>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading catalog and links…</p>
        ) : products.length === 0 ? (
          <p className="text-slate-500">No network products available to promote yet.</p>
        ) : (
          <>
            <div>
              <Label htmlFor="product">Select product to promote</Label>
              <select
                id="product"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.type})
                  </option>
                ))}
              </select>
            </div>

            {selected && (
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <ProductTypeBadge type={selected.type} />
                  <span className="text-sm text-slate-500">{selected.vendorName}</span>
                </div>
                <p className="mt-2 font-medium">{selected.title}</p>
                <div className="mt-4 flex gap-2">
                  <Input readOnly value={link} className="font-mono text-xs" />
                  <Button onClick={copyLink} variant="outline">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left">Link</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-right">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {links.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                    No saved creator links yet.
                  </td>
                </tr>
              ) : (
                links.map((row) => (
                  <tr key={row.id}>
                    <td className="max-w-xs truncate px-4 py-3 font-mono text-xs">
                      ?ref={row.slug}
                    </td>
                    <td className="px-4 py-3">{row.product?.title ?? row.label ?? "—"}</td>
                    <td className="px-4 py-3 text-right">{row.clickCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
