/** FOSLOne site content & links — aligned with https://www.foslone.com/ */

export const FOSLONE_SITE = "https://www.foslone.com";

export const hubUrl =
  process.env.NEXT_PUBLIC_HUB_URL ?? "http://localhost:3000";

export const hubLoginUrl = `${hubUrl}/auth/sign-in`;
export const hubVendorUrl = `${hubUrl}/vendor`;
export const hubCreatorUrl = `${hubUrl}/creator`;

export const externalLinks = {
  socomOtt: "https://www.foslone.com/socomm-ott/",
  signupCreator: `${FOSLONE_SITE}/signup-as-a-coseller/`,
  fosloneContact: `${FOSLONE_SITE}/contact-us/`,
} as const;

export const featuredBlogPosts = [
  {
    title: "Applied Research & Photonics",
    date: "July 5, 2024",
    excerpt: "Photonics and applied research products for commercial markets.",
  },
  {
    title: "OnCore Golf Products",
    date: "June 11, 2024",
    excerpt: "Performance golf equipment from OnCore.",
  },
  {
    title: "FarUV Lamps Overview",
    date: "May 31, 2024",
    excerpt: "Far-UVC disinfection technology overview.",
  },
  {
    title: "The CVAC Pod",
    date: "May 31, 2024",
    excerpt: "CVAC systems for recovery and wellness.",
  },
  {
    title: "Introducing KRYPTON-GUARD",
    date: "May 14, 2024",
    excerpt: "Transforming disinfection standards.",
  },
  {
    title: "KRYPTON-MVP Portable Disinfection",
    date: "May 14, 2024",
    excerpt: "Ultimate portable disinfection device.",
  },
] as const;

export const creatorHighlights = [
  "Customers becoming Creators who promote products they love",
  "Media and subscribers joining the Creator network",
  "OPEN TANGLE attributing payments to every Creator on each sale",
  "Seller marketing budgets shifting from pre-pay to post-pay via Creators",
  "Exponential sales growth and job creation across communities",
] as const;
