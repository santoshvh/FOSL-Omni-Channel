import Link from "next/link";
import { Button } from "@fosl/ui";
import { externalLinks, hubLoginUrl } from "@/lib/foslone";

export default function IncubationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Incubations</h1>
      <p className="mt-2 text-slate-600">
        Social eCommerce startups incubated through FOSLOne and AIOne
      </p>

      <div className="mt-8 space-y-6 text-slate-700 leading-relaxed">
        <p>
          FOSLOne incubates startup companies that bring products and services to social
          eCommerce communities. Each incubated seller gains access to operator storefronts,
          the FOSLOne marketplace, and a growing network of Creators who promote listings
          for commission.
        </p>
        <p>
          Incubated by <strong>AIOne</strong>, we help founders launch faster with catalog tools,
          Stripe payouts, and commission attribution through OPEN TANGLE.
        </p>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h2 className="font-semibold">For sellers &amp; vendors</h2>
          <p className="mt-2 text-sm text-slate-600">
            List on native catalog or connect Shopify/WooCommerce. Operators curate your SKUs
            for their branded storefronts while Creators drive traffic.
          </p>
          <Button asChild className="mt-4">
            <a href={hubLoginUrl}>Seller login — open Hub</a>
          </Button>
        </div>

        <div className="rounded-lg border border-slate-200 p-6">
          <h2 className="font-semibold">Apply for incubation</h2>
          <p className="mt-2 text-sm text-slate-600">
            Tell us about your product line and community goals. Our team reviews applications
            on a rolling basis.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
