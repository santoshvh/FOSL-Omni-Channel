import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, ProductTypeBadge, formatCurrency } from "@fosl/ui";
import { products } from "@fosl/mocks";

export default function OperatorCatalogPage() {
  const listed = products.filter((p) => p.published);

  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Storefront catalog</h1>
            <p className="text-slate-600">Products live on demo.fosl.store</p>
          </div>
          <Button asChild>
            <Link href="/operator/catalog/import">Import from vendors</Link>
          </Button>
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
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium">{p.title}</td>
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
