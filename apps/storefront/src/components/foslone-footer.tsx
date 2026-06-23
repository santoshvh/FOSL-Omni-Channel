import Link from "next/link";
import Image from "next/image";
import { FoslLogo } from "@fosl/ui";
import { externalLinks, fosloneImages, hubLoginUrl } from "@/lib/foslone";
import { legalPageHref, legalPages } from "@/lib/legal";

const footerLegalSlugs = [
  "terms",
  "privacy",
  "returns",
  "shipping",
  "cookies",
] as const;

export function FosloneFooter() {
  return (
    <footer className="border-t border-slate-100 bg-ink text-white">
      <div className="ecom-container py-12">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="inline-block rounded-lg bg-white px-3 py-2">
              <FoslLogo height={32} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              FOSLOne — social eCommerce incubated by AIOne. Empowering Creators, sellers, and
              buyers in community-driven commerce.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-white/70 hover:text-primary">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white/70 hover:text-primary">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/incubations" className="text-white/70 hover:text-primary">
                  Incubations
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Programs</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={externalLinks.socomOtt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-primary"
                >
                  SoComOTT
                </a>
              </li>
              <li>
                <Link href="/creator-support" className="text-white/70 hover:text-primary">
                  Creator Support
                </Link>
              </li>
              <li>
                <a
                  href={externalLinks.signupCreator}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-primary"
                >
                  Sign up as Creator
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLegalSlugs.map((slug) => {
                const page = legalPages.find((p) => p.slug === slug)!;
                return (
                  <li key={slug}>
                    <Link href={legalPageHref(slug)} className="text-white/70 hover:text-primary">
                      {page.title}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link href="/legal" className="text-white/70 hover:text-primary">
                  All policies
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-white/70 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href={hubLoginUrl} className="text-white/70 hover:text-primary">
                  Hub login
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center gap-6 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <div className="relative h-24 w-24 opacity-90">
            <Image
              src={fosloneImages.foslSeal}
              alt="FOSL seal"
              fill
              className="object-contain"
              sizes="96px"
            />
          </div>
          <p className="text-center text-xs text-white/40 sm:text-right">
            © {new Date().getFullYear()} FOSL / FOSLOne. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
