import { Button } from "@fosl/ui";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform settings</h1>
        <p className="text-slate-600">Feature flags and global configuration</p>
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Feature flags</h2>
        {[
          { id: "marketplace", label: "Master marketplace (fosl.com)", on: true },
          { id: "referral_tree", label: "Creator referral tree (2-level)", on: true },
          { id: "lead_gen", label: "Lead-gen product type", on: true },
          { id: "bigcommerce", label: "BigCommerce integration (beta)", on: false },
        ].map((f) => (
          <label key={f.id} className="flex items-center justify-between border-b border-slate-100 py-3 text-sm last:border-0">
            <span>{f.label}</span>
            <input type="checkbox" defaultChecked={f.on} />
          </label>
        ))}
        <Button className="mt-2">Save flags</Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Email templates</h2>
        <p className="mt-2 text-sm text-slate-500">Preview transactional emails sent via Postmark</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex justify-between rounded-md border border-slate-100 px-3 py-2">
            <span>Order confirmation</span>
            <Button variant="ghost" size="sm">Preview</Button>
          </li>
          <li className="flex justify-between rounded-md border border-slate-100 px-3 py-2">
            <span>Payout completed</span>
            <Button variant="ghost" size="sm">Preview</Button>
          </li>
          <li className="flex justify-between rounded-md border border-slate-100 px-3 py-2">
            <span>Sync failure alert</span>
            <Button variant="ghost" size="sm">Preview</Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
