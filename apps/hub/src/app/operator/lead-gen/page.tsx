import { HubShell } from "@/components/hub-shell";
import { Button } from "@fosl/ui";

export default function OperatorLeadGenPage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Lead-gen settings</h1>
          <p className="text-slate-600">Control paid and free lead products on your storefront</p>
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable lead-gen products</p>
              <p className="text-sm text-slate-500">Allow vendors to list consultation and quote requests</p>
            </div>
            <input type="checkbox" defaultChecked />
          </label>
          <label className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="font-medium">Require double opt-in</p>
              <p className="text-sm text-slate-500">GDPR consent before forwarding leads to vendors</p>
            </div>
            <input type="checkbox" defaultChecked />
          </label>
          <label className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="font-medium">Paid lead products</p>
              <p className="text-sm text-slate-500">Allow vendors to charge for qualified leads</p>
            </div>
            <input type="checkbox" />
          </label>
          <Button>Save settings</Button>
        </div>
      </div>
    </HubShell>
  );
}
