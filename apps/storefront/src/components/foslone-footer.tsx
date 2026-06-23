import Link from "next/link";
import { FOSLONE_SITE, externalLinks } from "@/lib/foslone";

export function FosloneFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-[#2E75B6]">FOSLOne</p>
            <p className="mt-2 text-sm text-slate-600">
              Incubated by AIOne
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Platform</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-slate-600 hover:text-[#2E75B6]">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-slate-600 hover:text-[#2E75B6]">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/incubations" className="text-slate-600 hover:text-[#2E75B6]">
                  Incubations
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Community</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={externalLinks.signupCreator}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-[#2E75B6]"
                >
                  Sign up as a Creator
                </a>
              </li>
              <li>
                <Link href="/creator-support" className="text-slate-600 hover:text-[#2E75B6]">
                  Creator Support
                </Link>
              </li>
              <li>
                <a
                  href={externalLinks.socomOtt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-[#2E75B6]"
                >
                  SoComOTT
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Connect</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-[#2E75B6]">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href={FOSLONE_SITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-[#2E75B6]"
                >
                  foslone.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} FOSLOne. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
