import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fosl/ui";
import { Store, Package, Link2 } from "lucide-react";

export default function HomePage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome to FOSL Hub</h1>
          <p className="mt-1 text-slate-600">
            Switch roles in the header to explore Vendor, Creator, and Operator workspaces.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <Package className="h-8 w-8 text-[#2E75B6]" />
              <CardTitle className="mt-2">Vendor</CardTitle>
              <CardDescription>
                Native catalog, Shopify/WooCommerce sync, shipping rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/vendor">Open vendor workspace</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Link2 className="h-8 w-8 text-[#2E75B6]" />
              <CardTitle className="mt-2">Creator</CardTitle>
              <CardDescription>
                Referral links, collections, earnings analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/creator">Open creator workspace</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Store className="h-8 w-8 text-[#2E75B6]" />
              <CardTitle className="mt-2">Operator</CardTitle>
              <CardDescription>
                Storefront curation, commissions, subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/operator">Open operator workspace</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </HubShell>
  );
}
