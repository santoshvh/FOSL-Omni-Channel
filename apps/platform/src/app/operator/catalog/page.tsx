"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@fosl/contracts";
import { HubShell } from "@/components/hub-shell";
import { Button, ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { Plus } from "lucide-react";

export default function OperatorCatalogPage() {
  const [listed, setListed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/operator-catalog")
      .then((res) => res.json())
      .then((json: { data: Product[] }) => setListed(json.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Storefront catalog</h1>
            <p className="text-slate-600">
              Products inherited from approved shared vendors on your operator storefront
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/operator/vendors">Manage vendors</Link>
            </Button>
            <Button asChild>
              <Link href="/operator/catalog/new">
                <Plus className="mr-2 h-4 w-4" />
                New product
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading catalog…</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Vendor</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listed.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/operator/catalog/${p.id}`}
                        className="text-primary-dark hover:underline"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <ProductTypeBadge type={p.type} />
                    </td>
                    <td className="px-4 py-3">{p.vendorName}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(p.priceCents)}</td>
                    <td className="px-4 py-3 text-green-600">Live</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HubShell>
  );
}
