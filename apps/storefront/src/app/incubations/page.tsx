import Link from "next/link";
import Image from "next/image";
import { Button } from "@fosl/ui";
import { externalLinks, fosloneImages } from "@/lib/foslone";
import { resolvePlatformUrls } from "@/lib/platform-urls";

export default function IncubationsPage() {
  const { hubLoginUrl } = resolvePlatformUrls();
  return (
    <div>
      <section className="relative overflow-hidden bg-surface">
        <div className="ecom-container grid items-center gap-8 py-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold text-ink">Incubations</h1>
            <p className="mt-2 text-slate-600">
              Social eCommerce startups incubated through FOSLOne and AIOne
            </p>
            <p className="mt-6 text-slate-700 leading-relaxed">
              FOSLOne incubates startup companies that bring products and services to social
              eCommerce communities. Each incubated seller gains access to operator storefronts,
              the FOSLOne marketplace, and a growing network of Creators.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={fosloneImages.heroCommunity}
              alt="FOSLOne incubation community"
              fill
              className="rounded-2xl object-cover shadow-soft"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <div className="ecom-container max-w-3xl space-y-6 py-12 text-slate-700 leading-relaxed">
        <p>
          Incubated by <strong>AIOne</strong>, we help founders launch faster with catalog tools,
          Stripe payouts, and commission attribution through OPEN TANGLE.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="relative mb-4 h-32">
              <Image
                src={fosloneImages.sectionSales}
                alt=""
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
            <h2 className="font-semibold text-ink">For sellers &amp; vendors</h2>
            <p className="mt-2 text-sm text-slate-600">
              List on native catalog or connect Shopify/WooCommerce. Operators curate your SKUs
              while Creators drive traffic.
            </p>
            <Button asChild className="mt-4">
              <a href={hubLoginUrl}>Seller login — open Hub</a>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <h2 className="font-semibold text-ink">Apply for incubation</h2>
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
    </div>
  );
}
