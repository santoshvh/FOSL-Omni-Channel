import Link from "next/link";
import { HubShell } from "@/components/hub-shell";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fosl/ui";
import { Plug, Package } from "lucide-react";

export default function CatalogSourcePage() {
  return (
    <HubShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Choose catalog source</h1>
          <p className="text-slate-600">
            Sell with a connected Shopify or WooCommerce store, or add products directly on FOSL.
          </p>
        </div>

        <div className="grid gap-4">
          <Card className="border-2 border-primary">
            <CardHeader>
              <Package className="h-8 w-8 text-primary-dark" />
              <CardTitle>Native catalog</CardTitle>
              <CardDescription>
                No external shop? Create products here with images, pricing, inventory, and shipping rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-4 list-inside list-disc text-sm text-slate-600">
                <li>Physical, digital, and lead-gen product types</li>
                <li>Manual shipping zones and rates</li>
                <li>Full control without sync delays</li>
              </ul>
              <Button asChild>
                <Link href="/vendor/catalog/new">Start with native catalog</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Plug className="h-8 w-8 text-slate-400" />
              <CardTitle>Connect a store</CardTitle>
              <CardDescription>
                Sync products, inventory, and shipping rates from Shopify or WooCommerce.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-4 list-inside list-disc text-sm text-slate-600">
                <li>Scheduled sync every 15 minutes (configurable)</li>
                <li>Shipping zones and rates imported automatically</li>
                <li>Orders pushed back to your shop on purchase</li>
              </ul>
              <Button variant="outline" asChild>
                <Link href="/vendor/integrations/connect">Connect Shopify or WooCommerce</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </HubShell>
  );
}
