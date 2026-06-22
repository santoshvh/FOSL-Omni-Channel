import { HubShell } from "@/components/hub-shell";
import { StatCard, StatCardCurrency } from "@fosl/ui";

export default function CreatorAnalyticsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Creator analytics</h1>
          <p className="text-slate-600">CTR, conversion, EPC — refreshes every 15 min</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="CTR" value="4.2%" hint="30-day average" trend="up" />
          <StatCard label="Conversion" value="2.8%" />
          <StatCard label="EPC" value="$0.84" trend="up" />
          <StatCardCurrency label="Total earnings" cents={34200} />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Performance by product</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2">Product</th>
                <th className="pb-2 text-right">Clicks</th>
                <th className="pb-2 text-right">Conv.</th>
                <th className="pb-2 text-right">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2">Wireless Bluetooth Headphones</td>
                <td className="py-2 text-right">1,240</td>
                <td className="py-2 text-right">3.1%</td>
                <td className="py-2 text-right">$152.00</td>
              </tr>
              <tr>
                <td className="py-2">E-Commerce Mastery Course</td>
                <td className="py-2 text-right">890</td>
                <td className="py-2 text-right">2.5%</td>
                <td className="py-2 text-right">$326.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </HubShell>
  );
}
