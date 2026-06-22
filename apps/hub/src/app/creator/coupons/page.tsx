import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button } from "@fosl/ui";
import { creatorCoupons } from "@fosl/mocks";
import { Plus } from "lucide-react";

export default function CreatorCouponsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Coupons</h1>
            <p className="text-slate-600">Creator-funded codes — deducted from your earnings</p>
          </div>
          <Button asChild>
            <Link href="/creator/coupons/new">
              <Plus className="mr-2 h-4 w-4" />
              Create coupon
            </Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Code</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Scope</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Discount</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Redemptions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {creatorCoupons.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.scope}</td>
                  <td className="px-4 py-3">{c.discount}</td>
                  <td className="px-4 py-3 text-right">
                    {c.redemptions}
                    {c.maxRedemptions != null && ` / ${c.maxRedemptions}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
