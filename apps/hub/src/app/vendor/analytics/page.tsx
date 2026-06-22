import { HubShell } from "@/components/hub-shell";
import { StatCard, StatCardCurrency } from "@fosl/ui";

export default function VendorAnalyticsPage() {
  return (
    <HubShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Vendor analytics</h1>
          <p className="text-slate-600">Sales by storefront and creator performance per SKU</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardCurrency label="Revenue (30d)" cents={124500} trend="up" hint="+12%" />
          <StatCard label="Units sold" value="186" />
          <StatCard label="Conversion rate" value="3.2%" />
          <StatCard label="Active creators" value="14" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Sales by storefront</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="pb-2">Storefront</th>
                  <th className="pb-2 text-right">Revenue</th>
                  <th className="pb-2 text-right">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2">demo.fosl.store</td>
                  <td className="py-2 text-right">$8,420</td>
                  <td className="py-2 text-right">62</td>
                </tr>
                <tr>
                  <td className="py-2">urban.fosl.store</td>
                  <td className="py-2 text-right">$4,030</td>
                  <td className="py-2 text-right">28</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Top creators per product</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Creator</th>
                  <th className="pb-2 text-right">Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2">WBH-001</td>
                  <td className="py-2">Alex Rivera</td>
                  <td className="py-2 text-right">38</td>
                </tr>
                <tr>
                  <td className="py-2">WBH-001</td>
                  <td className="py-2">Jordan Lee</td>
                  <td className="py-2 text-right">22</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HubShell>
  );
}
