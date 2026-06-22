import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Input, Label } from "@fosl/ui";

export default function OperatorDomainsPage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/operator/storefront" className="text-sm text-[#2E75B6] hover:underline">
          ← Storefront design
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Domain management</h1>
          <p className="text-slate-600">Primary and custom domains for demo.fosl.store</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Active domains</h2>
          <ul className="mt-4 divide-y text-sm">
            <li className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">demo.fosl.store</p>
                <p className="text-slate-500">Primary · SSL active</p>
              </div>
              <span className="text-green-600">Verified</span>
            </li>
            <li className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">shop.yourbrand.com</p>
                <p className="text-slate-500">CNAME → cname.fosl.store</p>
              </div>
              <span className="text-amber-600">DNS pending</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Add custom domain</h2>
          <div>
            <Label htmlFor="domain">Domain name</Label>
            <Input id="domain" placeholder="shop.example.com" className="mt-1" />
          </div>
          <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium">DNS instructions</p>
            <p className="mt-2 font-mono text-xs">CNAME shop.example.com → cname.fosl.store</p>
          </div>
          <Button>Add domain</Button>
        </div>
      </div>
    </HubShell>
  );
}
