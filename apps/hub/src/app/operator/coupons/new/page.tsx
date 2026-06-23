import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label } from "@fosl/ui";

export default function OperatorCouponNewPage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-xl space-y-6">
        <Link href="/operator/coupons" className="text-sm text-primary-dark hover:underline">
          ← Coupons
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create coupon</h1>
          <p className="text-slate-600">Funded from operator earnings — no-loss validation applies</p>
        </div>
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div>
            <Label htmlFor="code">Code *</Label>
            <Input id="code" placeholder="SPRING20" className="mt-1 font-mono uppercase" />
          </div>
          <div>
            <Label htmlFor="discount">Discount</Label>
            <select id="discount" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
              <option>Percentage</option>
              <option>Fixed amount</option>
            </select>
          </div>
          <div>
            <Label htmlFor="expires">Expires</Label>
            <Input id="expires" type="date" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="max">Max redemptions</Label>
            <Input id="max" type="number" placeholder="Unlimited" className="mt-1" />
          </div>
          <Button>Create coupon</Button>
        </div>
      </div>
    </HubShell>
  );
}
