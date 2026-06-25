import { HubShell } from "@/components/hub-shell";
import { StatCard, StatCardCurrency } from "@fosl/ui";

export default function OperatorAnalyticsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-slate-600">Revenue, top products, and creator performance</p>
          </div>
          <select className="rounded-md border border-slate-200 px-3 py-2 text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardCurrency label="Revenue" cents={892400} trend="up" hint="+8%" />
          <StatCard label="Orders" value="214" />
          <StatCard label="Conversion rate" value="3.4%" trend="up" />
          <StatCard label="Avg order value" value="$41.70" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Top products</h2>
            <table className="mt-4 w-full text-sm">
              <tbody className="divide-y">
                <tr>
                  <td className="py-2">Wireless Bluetooth Headphones</td>
                  <td className="py-2 text-right">62 sold</td>
                </tr>
                <tr>
                  <td className="py-2">E-Commerce Mastery Course</td>
                  <td className="py-2 text-right">38 sold</td>
                </tr>
                <tr>
                  <td className="py-2">Ceramic Travel Mug</td>
                  <td className="py-2 text-right">29 sold</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Top creators</h2>
            <table className="mt-4 w-full text-sm">
              <tbody className="divide-y">
                <tr>
                  <td className="py-2">Alex Rivera</td>
                  <td className="py-2 text-right">$1,240 driven</td>
                </tr>
                <tr>
                  <td className="py-2">Jordan Lee</td>
                  <td className="py-2 text-right">$890 driven</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HubShell>
  );
}
