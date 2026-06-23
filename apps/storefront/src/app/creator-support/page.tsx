import Link from "next/link";
import Image from "next/image";
import { Button } from "@fosl/ui";
import { externalLinks, fosloneImages, hubCreatorUrl, hubVendorUrl } from "@/lib/foslone";

export default function CreatorSupportPage() {
  return (
    <div>
      <section className="bg-surface">
        <div className="ecom-container grid items-center gap-8 py-12 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1 mx-auto aspect-square w-full max-w-md">
            <Image
              src={fosloneImages.sectionCreator}
              alt="Creator program"
              fill
              className="object-contain"
              sizes="400px"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h1 className="text-3xl font-bold text-ink">Creator Support</h1>
            <p className="mt-2 text-slate-600">
              Help for Creators earning commissions by promoting seller products
            </p>
            <p className="mt-4 text-slate-700 leading-relaxed">
              Creators promote seller products using referral links and social content. When a
              purchase completes, OPEN TANGLE attributes commission to the right Creator.
            </p>
            <Button asChild className="mt-6">
              <a href={externalLinks.signupCreator} target="_blank" rel="noopener noreferrer">
                Sign up as a Creator
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="ecom-container max-w-3xl space-y-8 py-12">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-ink">Creator Hub tools</h2>
          <p className="mt-2 text-sm text-slate-600">
            Generate links, track CTR and earnings, build collections, and view your referral
            tree in the FOSL Creator workspace.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <a href={hubCreatorUrl}>Login to Creator Hub</a>
          </Button>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-ink">Seller support</h2>
          <p className="mt-2 text-sm text-slate-600">
            Vendors manage catalog, integrations, payouts, and operator relationships in the
            Vendor workspace.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <a href={hubVendorUrl}>Vendor dashboard</a>
          </Button>
        </section>

        <section className="rounded-2xl border border-primary/30 bg-primary-muted p-6">
          <h2 className="font-semibold text-ink">Need help?</h2>
          <p className="mt-2 text-sm text-slate-700">
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
