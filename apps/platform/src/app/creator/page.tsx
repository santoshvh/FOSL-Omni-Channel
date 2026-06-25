import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, StatCard, StatCardCurrency } from "@fosl/ui";

export default function CreatorDashboardPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Creator dashboard</h1>
            <p className="text-slate-600">Promote products and track referral performance</p>
          </div>
          <Button asChild>
            <Link href="/creator/links">Generate link</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardCurrency label="Total earnings" cents={34200} hint="$12.40 pending clearance" />
          <StatCard label="CTR" value="4.2%" hint="Across all links (30d)" trend="up" />
          <StatCard label="Conversion rate" value="2.8%" hint="Clicks → purchases" />
          <StatCard label="EPC" value="$0.84" hint="Earnings per click" trend="up" />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Top performing links</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2">Product</th>
                <th className="pb-2">Type</th>
                <th className="pb-2 text-right">Clicks</th>
                <th className="pb-2 text-right">Conversions</th>
                <th className="pb-2 text-right">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3">Wireless Bluetooth Headphones</td>
                <td className="py-3">Physical</td>
                <td className="py-3 text-right">1,240</td>
                <td className="py-3 text-right">38</td>
                <td className="py-3 text-right">$152.00</td>
              </tr>
              <tr>
                <td className="py-3">E-Commerce Mastery Course</td>
                <td className="py-3">Digital</td>
                <td className="py-3 text-right">890</td>
                <td className="py-3 text-right">22</td>
                <td className="py-3 text-right">$326.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
