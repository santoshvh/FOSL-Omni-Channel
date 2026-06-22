import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, ProductTypeBadge } from "@fosl/ui";
import { products } from "@fosl/mocks";
import { formatCurrency } from "@fosl/ui";

export default function OperatorCatalogImportPage() {
  const synced = products.filter((p) => p.vendorId === "ven_1" || p.vendorId === "ven_4");

  return (
    <HubShell>
      <div className="space-y-6">
        <Link href="/operator/catalog" className="text-sm text-[#2E75B6] hover:underline">
          ← Storefront catalog
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Import from vendor catalog</h1>
          <p className="text-slate-600">Browse synced SKUs and bulk-add to your storefront</p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <select className="rounded-md border border-slate-200 px-3 py-2">
            <option>All vendors</option>
            <option>Acme Audio Co.</option>
            <option>Bright Labs</option>
          </select>
          <select className="rounded-md border border-slate-200 px-3 py-2">
            <option>All product types</option>
            <option>Physical</option>
            <option>Digital</option>
            <option>Lead gen</option>
          </select>
          <Button size="sm">Import selected (0)</Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" aria-label="Select all" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Product</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Vendor</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Price</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">On storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {synced.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <input type="checkbox" />
                  </td>
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-slate-500">{p.vendorName}</td>
                  <td className="px-4 py-3">
                    <ProductTypeBadge type={p.type} />
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(p.priceCents)}</td>
                  <td className="px-4 py-3 text-green-600">Listed</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
