"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label, ProductTypeBadge } from "@fosl/ui";
import type { Product } from "@fosl/contracts";
import { Copy, Check, LayoutGrid, Table2, Star } from "lucide-react";

type CreatorLinkRow = {
  id: string;
  slug: string;
  label?: string | null;
  featured?: boolean;
  product?: {
    id: string;
    title: string;
    imageUrl?: string;
    type: Product["type"] | string;
    vendor?: { name: string };
  } | null;
};

type LinksResponse = {
  data?: CreatorLinkRow[];
  profile?: { referralCode: string; displayName?: string | null };
};

type ViewMode = "cards" | "table";

function mapProductType(type: string): Product["type"] {
  if (type === "LEAD_GEN" || type === "lead_gen") return "lead_gen";
  if (type === "DIGITAL" || type === "digital") return "digital";
  return "physical";
}

export default function CreatorLinksPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [links, setLinks] = useState<CreatorLinkRow[]>([]);
  const [referralCode, setReferralCode] = useState("CREATOR");
  const [selectedId, setSelectedId] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const storefrontBase =
    process.env.NEXT_PUBLIC_STOREFRONT_URL?.replace(/\/$/, "") ?? "https://shop.foslone.com";

  const productLinks = useMemo(
    () => links.filter((row) => row.product?.id),
    [links]
  );

  const selected = products.find((p) => p.id === selectedId);

  const loadData = useCallback(async () => {
    const [linksJson, productsJson] = await Promise.all([
      fetch("/api/v1/creator/links").then((r) => r.json() as Promise<LinksResponse>),
      fetch("/api/v1/network/products").then((r) => r.json() as Promise<{ data?: Product[] }>),
    ]);
    const items = Array.isArray(productsJson.data) ? productsJson.data : [];
    setProducts(items);
    setLinks(Array.isArray(linksJson.data) ? linksJson.data : []);
    if (linksJson.profile?.referralCode) setReferralCode(linksJson.profile.referralCode);
    return items;
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadData()
      .then((items) => {
        if (!cancelled && items[0]) setSelectedId((prev) => prev || items[0].id);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadData]);

  async function generateLink() {
    if (!selectedId) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/v1/creator/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: selectedId }),
      });
      const json = (await res.json()) as { data?: { url?: string }; error?: string };
      if (!res.ok || !json.data?.url) throw new Error(json.error ?? "Failed");
      setGeneratedUrl(json.data.url);
      await loadData();
    } catch {
      const fallback = `${storefrontBase}/marketplace/products/${selectedId}?ref=${encodeURIComponent(referralCode)}&add=1`;
      setGeneratedUrl(fallback);
    } finally {
      setGenerating(false);
    }
  }

  function linkUrl(row: CreatorLinkRow) {
    if (!row.product?.id) return "";
    return `${storefrontBase}/marketplace/products/${row.product.id}?ref=${encodeURIComponent(row.slug)}&add=1`;
  }

  async function toggleFeatured(linkId: string, featured: boolean) {
    const res = await fetch(`/api/v1/creator/links/${linkId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured }),
    });
    if (res.ok) await loadData();
  }

  function copyText(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <HubShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Referral links</h1>
          <p className="text-slate-600">
            Links add the product to cart on open · 30-day last-click attribution
          </p>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading catalog and links…</p>
        ) : products.length === 0 ? (
          <p className="text-slate-500">No network products available to promote yet.</p>
        ) : (
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
            <div>
              <Label htmlFor="product">Generate link for product</Label>
              <select
                id="product"
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setGeneratedUrl("");
                }}
                className="mt-1 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.type})
                  </option>
                ))}
              </select>
            </div>

            {selected ? (
              <>
                <div className="flex items-center gap-2">
                  <ProductTypeBadge type={selected.type} />
                  <span className="text-sm text-slate-500">{selected.vendorName}</span>
                </div>
                <p className="font-medium">{selected.title}</p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={generateLink} disabled={generating}>
                    {generating ? "Generating…" : "Generate cart link"}
                  </Button>
                </div>
                {generatedUrl ? (
                  <div className="flex gap-2">
                    <Input readOnly value={generatedUrl} className="font-mono text-xs" />
                    <Button onClick={() => copyText(generatedUrl)} variant="outline">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold">Your product links</h2>
          <div className="flex rounded-md border border-slate-200 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`rounded px-2 py-1 text-sm ${viewMode === "cards" ? "bg-slate-100" : ""}`}
              aria-label="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded px-2 py-1 text-sm ${viewMode === "table" ? "bg-slate-100" : ""}`}
              aria-label="Table view"
            >
              <Table2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {productLinks.length === 0 ? (
          <p className="text-sm text-slate-500">Generate a link above to get started.</p>
        ) : viewMode === "cards" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {productLinks.map((row) => {
              const url = linkUrl(row);
              const product = row.product!;
              return (
                <div key={row.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <div className="relative h-28 bg-slate-100">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <ProductTypeBadge type={mapProductType(String(product.type))} />
                        <p className="mt-1 font-medium">{product.title}</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={row.featured ? "default" : "outline"}
                        onClick={() => toggleFeatured(row.id, !row.featured)}
                        aria-label={row.featured ? "Unpin from profile" : "Pin to profile"}
                      >
                        <Star className={`h-4 w-4 ${row.featured ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                    <Input readOnly value={url} className="font-mono text-xs" />
                    <Button variant="outline" size="sm" className="w-full" onClick={() => copyText(url)}>
                      <Copy className="mr-1.5 h-4 w-4" />
                      Copy link
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Link</th>
                  <th className="px-4 py-3 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {productLinks.map((row) => {
                  const url = linkUrl(row);
                  return (
                    <tr key={row.id}>
                      <td className="px-4 py-3 font-medium">{row.product?.title ?? "—"}</td>
                      <td className="max-w-md px-4 py-3">
                        <div className="flex gap-2">
                          <span className="truncate font-mono text-xs">{url}</span>
                          <button
                            type="button"
                            onClick={() => copyText(url)}
                            className="shrink-0 text-slate-500 hover:text-slate-800"
                            aria-label="Copy link"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant={row.featured ? "default" : "outline"}
                          onClick={() => toggleFeatured(row.id, !row.featured)}
                        >
                          <Star className={`h-4 w-4 ${row.featured ? "fill-current" : ""}`} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HubShell>
  );
}
