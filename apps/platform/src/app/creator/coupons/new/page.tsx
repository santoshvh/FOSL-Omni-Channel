import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label } from "@fosl/ui";

export default function CreatorCouponNewPage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-xl space-y-6">
        <Link href="/creator/coupons" className="text-sm text-primary-dark hover:underline">
          ← Coupons
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create coupon</h1>
          <p className="text-slate-600">Funded from creator earnings balance</p>
        </div>
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <div>
            <Label htmlFor="code">Code *</Label>
            <Input id="code" placeholder="ALEX15" className="mt-1 font-mono uppercase" />
          </div>
          <div>
            <Label htmlFor="discount">Discount amount (%)</Label>
            <Input id="discount" type="number" defaultValue={15} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="max">Max redemptions</Label>
            <Input id="max" type="number" defaultValue={200} className="mt-1" />
          </div>
          <Button>Create coupon</Button>
        </div>
      </div>
    </HubShell>
  );
}
