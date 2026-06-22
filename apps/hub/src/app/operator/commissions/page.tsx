"use client";

import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";

export default function OperatorCommissionsPage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Commission rules</h1>
          <p className="text-slate-600">Global rules with per-product overrides · no-loss validation</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Global storefront rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="creator">Creator commission (% of base)</Label>
                <Input id="creator" type="number" defaultValue={10} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="operator">Operator margin (% of base)</Label>
                <Input id="operator" type="number" defaultValue={15} className="mt-1" />
              </div>
            </div>
            <p className="rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-800">
              Platform fee 5% applied first. Vendor receives remainder. All values validated at save.
            </p>
            <Button>Save global rules</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Per-product override</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Product SKU</Label>
              <Input placeholder="WBH-001" className="mt-1" />
            </div>
            <div>
              <Label>Creator commission override (%)</Label>
              <Input type="number" placeholder="12" className="mt-1" />
            </div>
            <Button variant="outline">Add override</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attribution model</CardTitle>
          </CardHeader>
          <CardContent>
            <select className="flex h-10 w-full rounded-md border border-slate-200 px-3 text-sm" defaultValue="last_click">
              <option value="last_click">Last click (active)</option>
              <option disabled>First click (coming soon)</option>
              <option disabled>Linear (coming soon)</option>
            </select>
          </CardContent>
        </Card>
      </div>
    </HubShell>
  );
}
