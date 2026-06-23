"use client";

import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@fosl/ui";

export default function OperatorStorefrontPage() {
  return (
    <HubShell>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Storefront design</h1>
            <p className="text-slate-600">Branding, colors, and layout for your storefront at /</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Store name</Label>
                <Input defaultValue="Demo Store" className="mt-1" />
              </div>
              <div>
                <Label>Logo</Label>
                <Input type="file" accept="image/*" className="mt-1" />
              </div>
              <div>
                <Label>Primary color</Label>
                <div className="mt-1 flex gap-2">
                  <Input defaultValue="#2E75B6" className="font-mono" />
                  <div className="h-10 w-10 shrink-0 rounded-md bg-[#2E75B6]" />
                </div>
              </div>
              <div>
                <Label>Hero headline</Label>
                <Input defaultValue="Discover products from trusted vendors" className="mt-1" />
              </div>
              <Button>Save design</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Domains</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Store path:</span> / (operator home)
              </p>
              <p className="text-slate-500">Vendor stores use paths like /acme-audio, /bright-labs</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/operator/domains">Manage domains</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-medium uppercase text-slate-500">Live preview</p>
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="bg-[#2E75B6] px-4 py-3 text-white font-bold">Demo Store</div>
            <div className="p-6 text-center">
              <h2 className="text-lg font-semibold">Discover products from trusted vendors</h2>
              <Button className="mt-4" size="sm">
                Browse products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </HubShell>
  );
}
