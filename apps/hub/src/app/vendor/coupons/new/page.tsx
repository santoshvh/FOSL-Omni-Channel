import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";

export default function VendorCouponNewPage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create coupon</h1>
          <p className="text-slate-600">Discount funded from your vendor earnings</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Coupon details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code">Code *</Label>
              <Input id="code" placeholder="SUMMER20" className="mt-1 font-mono uppercase" />
            </div>
            <div>
              <Label htmlFor="scope">Scope *</Label>
              <select id="scope" className="mt-1 flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm">
                <option>Vendor-wide</option>
                <option>Single product</option>
                <option>Collection</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="type">Discount type</Label>
                <select id="type" className="mt-1 flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm">
                  <option>Percentage</option>
                  <option>Fixed amount</option>
                </select>
              </div>
              <div>
                <Label htmlFor="value">Value *</Label>
                <Input id="value" type="number" placeholder="20" className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="expires">Expiry date *</Label>
              <Input id="expires" type="date" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="max">Max redemptions (optional)</Label>
              <Input id="max" type="number" placeholder="100" className="mt-1" />
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button>Create coupon</Button>
          <Button variant="outline" asChild>
            <Link href="/vendor/coupons">Cancel</Link>
          </Button>
        </div>
      </div>
    </HubShell>
  );
}
