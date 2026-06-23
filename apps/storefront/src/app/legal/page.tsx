import type { Metadata } from "next";
import Link from "next/link";
import { legalPages, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Legal — FOSLOne",
  description: "Terms, privacy, returns, shipping, cookies, and other legal policies for FOSLOne.",
};

export default function LegalIndexPage() {
  return (
    <div className="ecom-container max-w-3xl py-12">
      <h1 className="ecom-section-title">Legal & policies</h1>
      <p className="mt-3 leading-relaxed text-slate-600">
        FOSLOne is committed to transparent policies for buyers, Creators, and Vendors. Review the
        documents below. Last updated: {LEGAL_LAST_UPDATED}.
      </p>

      <ul className="mt-10 space-y-4">
        {legalPages.map((page) => (
          <li key={page.slug}>
            <Link
              href={`/legal/${page.slug}`}
              className="ecom-card block p-5 transition hover:border-primary"
            >
              <h2 className="font-semibold text-ink">{page.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{page.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-slate-500">
        Questions?{" "}
        <Link href="/contact" className="font-medium text-ink hover:text-primary-dark">
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}
