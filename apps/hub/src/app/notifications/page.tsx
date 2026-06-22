import { HubShell } from "@/components/hub-shell";
import { Button } from "@fosl/ui";

const prefs = [
  { id: "orders", label: "Order updates", desc: "New orders, fulfillment, refunds" },
  { id: "commission", label: "Commission earned", desc: "Creator earnings and clearance" },
  { id: "payout", label: "Payouts", desc: "Transfer initiated and completed" },
  { id: "sync", label: "Catalog sync", desc: "Integration failures and completions" },
  { id: "relationship", label: "Operator relationships", desc: "Approve/reject requests" },
];

export default function NotificationsPage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Notification preferences</h1>
          <p className="text-slate-600">Choose what you receive by email and in-app</p>
        </div>

        <ul className="divide-y rounded-lg border border-slate-200 bg-white">
          {prefs.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium">{p.label}</p>
                <p className="text-sm text-slate-500">{p.desc}</p>
              </div>
              <div className="flex shrink-0 gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  Email
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  In-app
                </label>
              </div>
            </li>
          ))}
        </ul>

        <Button>Save preferences</Button>
      </div>
    </HubShell>
  );
}
