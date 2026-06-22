import Link from "next/link";
import { Button } from "@fosl/ui";
import { CheckCircle } from "lucide-react";

export default function MarketplaceConfirmationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
      <h1 className="mt-6 text-2xl font-bold">Master order confirmed</h1>
      <p className="mt-2 text-slate-600">Order number: <strong>MKT-2049</strong></p>

      <div className="mt-8 space-y-4 rounded-lg border border-slate-200 p-6 text-left text-sm">
        <h2 className="font-semibold">Split fulfillment summary</h2>
        <div className="rounded-md border border-slate-100 p-3">
          <p className="font-medium">Acme Audio Co. · Demo Storefront</p>
          <p className="text-slate-500">Wireless Bluetooth Headphones — shipping in 2–3 days</p>
        </div>
        <div className="rounded-md border border-slate-100 p-3">
          <p className="font-medium">Bright Labs · Urban Market</p>
          <p className="text-slate-500">Ceramic Travel Mug — processing</p>
        </div>
        <div className="rounded-md border border-purple-100 bg-purple-50 p-3">
          <p className="font-medium text-purple-900">Creator Academy · Demo Storefront</p>
          <p className="text-purple-800">E-Commerce Mastery Course — download link sent to your email</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/marketplace/orders/mord_1">View order</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/marketplace">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
