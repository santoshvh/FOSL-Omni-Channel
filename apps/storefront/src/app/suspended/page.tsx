import Link from "next/link";
import { Button } from "@fosl/ui";
import { AlertTriangle } from "lucide-react";

export default function StorefrontSuspendedPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <AlertTriangle className="mx-auto h-16 w-16 text-amber-500" />
      <h1 className="mt-4 text-2xl font-bold">Checkout temporarily unavailable</h1>
      <p className="mt-3 text-slate-600">
        This storefront&apos;s operator subscription is in a grace or suspended state. You can
        still browse products, but purchases are disabled until billing is resolved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild variant="outline">
          <Link href="/products">Continue browsing</Link>
        </Button>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
      <p className="mt-8 text-xs text-slate-400">
        Operator: contact support if you believe this is an error.
      </p>
    </div>
  );
}
