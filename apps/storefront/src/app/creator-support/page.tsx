import Link from "next/link";
import { Button } from "@fosl/ui";
import { externalLinks, hubCreatorUrl, hubVendorUrl } from "@/lib/foslone";

export default function CreatorSupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Creator Support</h1>
      <p className="mt-2 text-slate-600">
        Help for Creators earning commissions by promoting seller products
      </p>

      <div className="mt-8 space-y-8">
        <section className="rounded-lg border border-slate-200 p-6">
          <h2 className="font-semibold">Getting started</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Creators promote seller products using referral links and social content. When a
            purchase completes, OPEN TANGLE attributes commission to the right Creator —
            moving seller marketing from pre-pay to post-pay.
          </p>
          <Button asChild className="mt-4">
            <a href={externalLinks.signupCreator} target="_blank" rel="noopener noreferrer">
              Sign up as a Creator
            </a>
          </Button>
        </section>

        <section className="rounded-lg border border-slate-200 p-6">
          <h2 className="font-semibold">Creator Hub tools</h2>
          <p className="mt-2 text-sm text-slate-600">
            Generate links, track CTR and earnings, build collections, and view your referral
            tree in the FOSL Creator workspace.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <a href={hubCreatorUrl}>Login to Creator Hub</a>
          </Button>
        </section>

        <section className="rounded-lg border border-slate-200 p-6">
          <h2 className="font-semibold">Seller support</h2>
          <p className="mt-2 text-sm text-slate-600">
            Vendors manage catalog, integrations, payouts, and operator relationships in the
            Vendor workspace.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <a href={hubVendorUrl}>Vendor dashboard</a>
          </Button>
        </section>

        <section className="rounded-lg border border-blue-100 bg-blue-50 p-6">
          <h2 className="font-semibold text-blue-900">Need help?</h2>
          <p className="mt-2 text-sm text-blue-800">
            Visit the main FOSLOne support site or send us a message.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/contact">Contact us</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={externalLinks.fosloneContact} target="_blank" rel="noopener noreferrer">
                foslone.com support
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
