import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label } from "@fosl/ui";

export default function OperatorPromotionNewPage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-xl space-y-6">
        <Link href="/operator/promotions" className="text-sm text-[#2E75B6] hover:underline">
          ← Promotions
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New promotion</h1>
          <p className="text-slate-600">Bundles, buy-X-get-Y, or commission boosts</p>
        </div>
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div>
            <Label htmlFor="name">Promotion name *</Label>
            <Input id="name" placeholder="Spring Audio Bundle" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <select id="type" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
              <option value="bundle">Multi-vendor bundle</option>
              <option value="buy_x_get_y">Buy X get Y</option>
              <option value="commission_boost">Commission boost</option>
            </select>
          </div>
          <div>
            <Label htmlFor="vendors">Participating vendors</Label>
            <Input id="vendors" placeholder="Acme Audio, Bright Labs" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="ends">End date</Label>
            <Input id="ends" type="date" className="mt-1" />
          </div>
          <Button asChild>
            <Link href="/operator/promotions">Create promotion</Link>
          </Button>
        </div>
      </div>
    </HubShell>
  );
}
