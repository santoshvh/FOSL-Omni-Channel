import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { products } from "@fosl/mocks";
import { Plus } from "lucide-react";

export default function OperatorCatalogPage() {
  const listed = products.filter((p) => p.published);

  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Storefront catalog</h1>
            <p className="text-slate-600">Products live on the operator storefront at /products</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/operator/catalog/import">Import from vendors</Link>
            </Button>
            <Button asChild>
              <Link href="/operator/catalog/new">
                <Plus className="mr-2 h-4 w-4" />
                New product
              </Link>
            </Button>
          </div>
        </div>

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
                    <Link href={`/operator/catalog/${p.id}`} className="text-[#2E75B6] hover:underline">
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
      </div>
    </HubShell>
  );
}
