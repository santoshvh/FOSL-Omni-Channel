/** Legal entity & policy metadata — update LEGAL_LAST_UPDATED when policies change. */

export const LEGAL_LAST_UPDATED = "June 23, 2026";

export const companyLegal = {
  name: "FOSLOne",
  operator: "FOSLOne",
  parent: "AIOne",
  website: "https://www.foslone.com",
  privacyEmail: "privacy@foslone.com",
  legalEmail: "legal@foslone.com",
  supportEmail: "support@foslone.com",
  /** Placeholder — replace with registered address before production launch */
  address: "FOSLOne, c/o AIOne, United States",
  governingLaw: "State of Delaware, United States",
} as const;

export const legalPages = [
  {
    slug: "terms",
    title: "Terms of Service",
    description: "Rules for using the FOSLOne storefront, marketplace, and related services.",
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information.",
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    description: "Cookies and similar technologies used on FOSLOne properties.",
  },
  {
    slug: "returns",
    title: "Returns & Refunds Policy",
    description: "Return windows, refund eligibility, and how to request a return.",
  },
  {
    slug: "shipping",
    title: "Shipping Policy",
    description: "Delivery times, shipping methods, and vendor fulfillment.",
  },
  {
    slug: "creator-terms",
    title: "Creator Program Terms",
    description: "Commission attribution, payouts, and Creator responsibilities.",
  },
  {
    slug: "vendor-terms",
    title: "Seller & Vendor Terms",
    description: "Obligations for sellers listing products on the marketplace.",
  },
  {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    description: "Prohibited conduct on FOSLOne platforms.",
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    description: "Our commitment to accessible digital experiences.",
  },
] as const;

export type LegalPageSlug = (typeof legalPages)[number]["slug"];

export function getLegalPage(slug: string) {
  return legalPages.find((p) => p.slug === slug);
}

export function legalPageHref(slug: LegalPageSlug) {
  return `/legal/${slug}`;
}
