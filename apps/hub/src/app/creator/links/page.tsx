"use client";

import { useState } from "react";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label, ProductTypeBadge } from "@fosl/ui";
import { products } from "@fosl/mocks";
import { Copy, Check } from "lucide-react";

export default function CreatorLinksPage() {
  const [selectedId, setSelectedId] = useState(products[0].id);
  const [copied, setCopied] = useState(false);
  const selected = products.find((p) => p.id === selectedId)!;
  const link = `https://demo.fosl.store/p/${selected.id}?ref=CREATOR_ALEX`;

  function copyLink() {
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

        <div>
          <Label htmlFor="product">Select product, collection, or storefront</Label>
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

        <div className="rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left">Link</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3 text-right">Conv.</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.slice(0, 3).map((p) => (
                <tr key={p.id}>
                  <td className="max-w-xs truncate px-4 py-3 font-mono text-xs">
                    /p/{p.id}?ref=CREATOR_ALEX
                  </td>
                  <td className="px-4 py-3">
                    <ProductTypeBadge type={p.type} />
                  </td>
                  <td className="px-4 py-3 text-right">{Math.floor(Math.random() * 500 + 100)}</td>
                  <td className="px-4 py-3 text-right">{Math.floor(Math.random() * 20 + 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
