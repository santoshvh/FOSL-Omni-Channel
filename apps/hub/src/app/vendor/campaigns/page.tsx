import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, formatCurrency } from "@fosl/ui";
import { vendorCampaigns } from "@fosl/mocks";
import { Plus } from "lucide-react";

export default function VendorCampaignsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Growth campaigns</h1>
            <p className="text-slate-600">Commission boosts and featured placement bids</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New campaign
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Campaign</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Boost</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Budget</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Spent</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vendorCampaigns.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 capitalize">{c.type.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-right">+{c.boostPct}%</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(c.budgetCents)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(c.spentCents)}</td>
                  <td className="px-4 py-3 capitalize text-green-600">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-500">
          <Link href="/vendor/coupons" className="text-[#2E75B6] hover:underline">
            Manage coupons
          </Link>{" "}
          for discount-based promotions.
        </p>
      </div>
    </HubShell>
  );
}
