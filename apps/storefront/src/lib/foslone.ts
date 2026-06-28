/** FOSLOne site content & links — aligned with https://www.foslone.com/ */

export { resolvePlatformUrls, type PlatformUrls } from "@/lib/platform-urls";

import { resolvePlatformUrls } from "@/lib/platform-urls";

export const FOSLONE_SITE = "https://www.foslone.com";

const urls = resolvePlatformUrls();

export const platformUrl = urls.platformUrl;
/** @deprecated Use platformUrl */
export const hubUrl = urls.hubUrl;
export const adminUrl = urls.adminUrl;
export const hubLoginUrl = urls.hubLoginUrl;
export const hubVendorUrl = urls.hubVendorUrl;
export const hubCreatorUrl = urls.hubCreatorUrl;
export const platformAdminUrl = urls.platformAdminUrl;

export const externalLinks = {
  socomOtt: "https://www.socomott.com/net_channel/fosl",
  signupCreator: `${FOSLONE_SITE}/signup-as-a-coseller/`,
  fosloneContact: `${FOSLONE_SITE}/contact-us/`,
} as const;

/** Brand & site images (local /public) */
export const fosloneImages = {
  heroMain: "/stock/hero-online-shopping.jpg",
  heroCommunity: "/foslone/hero-community.jpeg",
  sectionSales: "/foslone/section-sales.svg",
  sectionCreator: "/foslone/section-creator.svg",
  sectionBuyers: "/foslone/section-buyers.svg",
  foslSeal: "/foslone/fosl-seal.svg",
  favicon: "/foslone/favicon.png",
} as const;

export const homeAudienceCards = [
  {
    href: "/creator-support",
    title: "Creator",
    desc: "Earn commissions promoting seller products across our eCommerce communities.",
    image: fosloneImages.sectionCreator,
    imageAlt: "Creator program illustration",
  },
  {
    href: "/incubations",
    title: "Seller focused",
    desc: "Incubated startups list products and grow sales through the Creator network.",
    image: fosloneImages.sectionSales,
    imageAlt: "Sales and growth illustration",
  },
  {
    href: "/products",
    title: "Buyers",
    desc: "Shop physical, digital, and lead-gen products from trusted vendors.",
    image: fosloneImages.sectionBuyers,
    imageAlt: "Shopping and buyers illustration",
  },
] as const;

export const teamMembers = {
  aione: [
    { name: "Shiva Balivada", role: "CEO", image: "/foslone/team-shiva.jpeg" },
    { name: "Dave Sackett", role: "CFO", image: "/foslone/team-dave.jpeg" },
  ],
  foslone: [
    { name: "Scott Livingston", role: "Principal Advisor", image: "/foslone/team-scott.jpeg" },
  ],
} as const;

export const featuredBlogPosts = [
  {
    title: "Applied Research & Photonics",
    date: "July 5, 2024",
    excerpt: "Photonics and applied research products for commercial markets.",
    image: "/foslone/blog-photonics.png",
  },
  {
    title: "OnCore Golf Products",
    date: "June 11, 2024",
    excerpt: "Performance golf equipment from OnCore.",
    image: "/foslone/blog-golf.png",
  },
  {
    title: "FarUV Lamps Overview",
    date: "May 31, 2024",
    excerpt: "Far-UVC disinfection technology overview.",
    image: "/foslone/blog-faruv.png",
  },
  {
    title: "The CVAC Pod",
    date: "May 31, 2024",
    excerpt: "CVAC systems for recovery and wellness.",
    image: "/foslone/blog-cvac.webp",
  },
  {
    title: "Introducing KRYPTON-GUARD",
    date: "May 14, 2024",
    excerpt: "Transforming disinfection standards.",
    image: "/foslone/blog-krypton-guard.png",
  },
  {
    title: "KRYPTON-MVP Portable Disinfection",
    date: "May 14, 2024",
    excerpt: "Ultimate portable disinfection device.",
    image: "/foslone/blog-krypton-mvp.png",
  },
] as const;

export const creatorHighlights = [
  "Customers becoming Creators who promote products they love",
  "Media and subscribers joining the Creator network",
  "OPEN TANGLE attributing payments to every Creator on each sale",
  "Seller marketing budgets shifting from pre-pay to post-pay via Creators",
  "Exponential sales growth and job creation across communities",
] as const;
