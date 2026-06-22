import Link from "next/link";
import { platformOperators } from "@fosl/mocks";
import { formatCurrency } from "@fosl/ui";
import { Button } from "@fosl/ui";

export default function AdminOperatorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Operators</h1>
        <p className="text-slate-600">Approve and manage network operators</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Operator</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Plan</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Storefronts</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">GMV (30d)</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {platformOperators.map((op) => (
              <tr key={op.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{op.name}</p>
                  <p className="text-xs text-slate-500">{op.email}</p>
                </td>
                <td className="px-4 py-3">{op.plan}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      op.status === "active"
                        ? "text-green-600"
                        : op.status === "grace_period"
                          ? "text-amber-600"
                          : "text-slate-600"
                    }
                  >
                    {op.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{op.storefronts}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(op.gmvCents)}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/operators/${op.id}`}>Manage</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
