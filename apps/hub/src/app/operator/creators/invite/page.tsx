import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label } from "@fosl/ui";

export default function OperatorCreatorInvitePage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-xl space-y-6">
        <Link href="/operator/creators" className="text-sm text-[#2E75B6] hover:underline">
          ← Creators
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Invite creator</h1>
          <p className="text-slate-600">Send an email invite with default commission rate</p>
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div>
            <Label htmlFor="email">Email address *</Label>
            <Input id="email" type="email" placeholder="creator@example.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="rate">Default commission rate (%)</Label>
            <Input id="rate" type="number" defaultValue={8} min={1} max={50} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message">Personal message (optional)</Label>
            <Input id="message" placeholder="Join our storefront affiliate program" className="mt-1" />
          </div>
          <Button>Send invite</Button>
        </div>
      </div>
    </HubShell>
  );
}
