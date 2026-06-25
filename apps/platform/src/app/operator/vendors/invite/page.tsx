import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label } from "@fosl/ui";

export default function OperatorVendorInvitePage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-xl space-y-6">
        <Link href="/operator/vendors" className="text-sm text-primary-dark hover:underline">
          ← Vendors
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Invite vendor</h1>
          <p className="text-slate-600">Send an email invite to join your storefront network</p>
        </div>
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div>
            <Label htmlFor="email">Vendor email *</Label>
            <Input id="email" type="email" placeholder="vendor@company.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="company">Company name</Label>
            <Input id="company" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="commission">Default operator margin (%)</Label>
            <Input id="commission" type="number" defaultValue={12} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Input id="message" placeholder="Join our FOSLOne storefront" className="mt-1" />
          </div>
          <Button>Send invite</Button>
        </div>
      </div>
    </HubShell>
  );
}
