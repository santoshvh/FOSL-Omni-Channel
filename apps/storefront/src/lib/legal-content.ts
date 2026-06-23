import type { LegalPageSlug } from "./legal";
import { companyLegal } from "./legal";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
};

export type LegalPageContent = {
  intro?: string[];
  sections: LegalSection[];
};

function p(...lines: string[]): string[] {
  return lines;
}

const sharedMarketplace = `FOSLOne operates a multi-vendor marketplace. Individual sellers ("Vendors") are responsible for their product listings, fulfillment, and compliance with applicable laws. ${companyLegal.name} provides the platform and payment facilitation but is not the seller of record unless explicitly stated on a product page.`;

export const legalContent: Record<LegalPageSlug, LegalPageContent> = {
  terms: {
    intro: p(
      `These Terms of Service ("Terms") govern your access to and use of websites, storefronts, and services operated by ${companyLegal.operator} ("${companyLegal.name}," "we," "us," or "our"), including marketplace checkout, Creator tools, and vendor programs. By accessing or using our services, you agree to these Terms.`,
      `If you do not agree, do not use our services.`
    ),
    sections: [
      {
        id: "eligibility",
        title: "1. Eligibility",
        paragraphs: p(
          "You must be at least 18 years old (or the age of majority in your jurisdiction) to make purchases or register for a Creator or Vendor account. By using our services, you represent that you meet this requirement and that your use complies with applicable laws."
        ),
      },
      {
        id: "accounts",
        title: "2. Accounts & security",
        list: [
          "You are responsible for maintaining the confidentiality of your account credentials.",
          "You must provide accurate, current information and keep it updated.",
          "Notify us promptly at " + companyLegal.supportEmail + " of any unauthorized use of your account.",
          "We may suspend or terminate accounts that violate these Terms or our Acceptable Use Policy.",
        ],
      },
      {
        id: "orders",
        title: "3. Orders & payments",
        paragraphs: p(
          sharedMarketplace,
          "Prices, taxes, and shipping are shown at checkout. Payment is processed by our payment partners (e.g., Stripe). An order is accepted when you receive an order confirmation email. We reserve the right to cancel orders for suspected fraud, pricing errors, or inventory issues, with a full refund when applicable."
        ),
      },
      {
        id: "digital",
        title: "4. Digital products & licenses",
        paragraphs: p(
          "Digital goods are licensed, not sold, unless otherwise stated. Unless a product page specifies otherwise, digital purchases grant a personal, non-exclusive, non-transferable license for your own use. Redistribution, resale, or public sharing of digital files is prohibited without written permission from the rights holder."
        ),
      },
      {
        id: "lead-gen",
        title: "5. Consultations & lead-generation offers",
        paragraphs: p(
          "Some listings are lead-generation or consultation offers. Submitting a request does not guarantee availability. Vendors may contact you using the information you provide. Cancellation and refund terms for these offers are described on the product page and in our Returns & Refunds Policy."
        ),
      },
      {
        id: "creator",
        title: "6. Creator program",
        paragraphs: p(
          "Participation in the Creator program is subject to the Creator Program Terms. Commission attribution, cookie duration, and payout rules are defined in those terms and may be updated with notice."
        ),
      },
      {
        id: "ip",
        title: "7. Intellectual property",
        paragraphs: p(
          `${companyLegal.name} logos, branding, and platform content are owned by us or our licensors. You may not copy, modify, or distribute our materials without permission. User-generated content you submit grants us a limited license to host, display, and promote it in connection with the services.`
        ),
      },
      {
        id: "disclaimers",
        title: "8. Disclaimers",
        paragraphs: p(
          `Services are provided "as is" and "as available" to the fullest extent permitted by law. We do not warrant uninterrupted or error-free operation. Vendor product descriptions, images, and claims are the responsibility of each Vendor.`
        ),
      },
      {
        id: "liability",
        title: "9. Limitation of liability",
        paragraphs: p(
          `To the maximum extent permitted by law, ${companyLegal.name} and ${companyLegal.parent} shall not be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits or data. Our aggregate liability for claims arising from your use of the services shall not exceed the greater of (a) amounts you paid us in the twelve months before the claim or (b) one hundred U.S. dollars (USD $100). Some jurisdictions do not allow certain limitations; in those cases, our liability is limited to the fullest extent permitted by law.`
        ),
      },
      {
        id: "disputes",
        title: "10. Dispute resolution & governing law",
        paragraphs: p(
          `These Terms are governed by the laws of the ${companyLegal.governingLaw}, without regard to conflict-of-law principles. For U.S. consumers, you may bring claims in small claims court where eligible. Otherwise, disputes shall be resolved by binding arbitration on an individual basis, except you may opt out within 30 days of first accepting these Terms by emailing ${companyLegal.legalEmail}. Class actions and class arbitrations are waived to the extent permitted by law.`,
          "EU/UK consumers retain mandatory rights under local consumer protection laws that cannot be waived by contract."
        ),
      },
      {
        id: "changes",
        title: "11. Changes",
        paragraphs: p(
          "We may update these Terms. Material changes will be posted on this page with an updated date. Continued use after changes constitutes acceptance. If you disagree with changes, stop using the services."
        ),
      },
      {
        id: "contact",
        title: "12. Contact",
        paragraphs: p(
          `Questions about these Terms: ${companyLegal.legalEmail} or our Contact page.`
        ),
      },
    ],
  },

  privacy: {
    intro: p(
      `This Privacy Policy describes how ${companyLegal.operator} ("${companyLegal.name}") collects, uses, discloses, and protects personal information when you use our websites, storefronts, marketplace, Creator hub, and related services.`,
      "We are committed to transparency and compliance with applicable privacy laws, including the EU/UK GDPR, California Consumer Privacy Act (CCPA/CPRA), and other U.S. state privacy laws where applicable."
    ),
    sections: [
      {
        id: "controller",
        title: "1. Who we are",
        paragraphs: p(
          `${companyLegal.name} (incubated by ${companyLegal.parent}) is the data controller for personal information processed through our platform, except where a Vendor processes your data as an independent controller for order fulfillment and support.`,
          `Privacy inquiries: ${companyLegal.privacyEmail}`
        ),
      },
      {
        id: "collect",
        title: "2. Information we collect",
        list: [
          "Identity & contact: name, email, phone, shipping and billing address.",
          "Account & profile: login credentials, Creator or Vendor profile details, preferences.",
          "Transaction data: order history, cart contents, payment status (card details are processed by Stripe; we do not store full card numbers).",
          "Creator attribution: referral links, cookies, and commission-related identifiers (see Cookie Policy).",
          "Technical data: IP address, browser type, device identifiers, pages viewed, and similar usage data.",
          "Communications: messages you send via contact forms, support tickets, or email.",
          "Marketing preferences: opt-in status for promotional emails.",
        ],
      },
      {
        id: "sources",
        title: "3. Sources of information",
        list: [
          "Directly from you when you register, checkout, or contact us.",
          "Automatically through cookies and similar technologies.",
          "From payment processors, shipping carriers, and fraud-prevention partners.",
          "From Vendors when they fulfill orders or respond to lead-generation requests.",
        ],
      },
      {
        id: "use",
        title: "4. How we use information",
        list: [
          "Provide, operate, and improve our services.",
          "Process orders, payments, refunds, and Creator commissions.",
          "Authenticate users and prevent fraud and abuse.",
          "Send transactional emails (order confirmations, shipping updates).",
          "Send marketing communications where you have opted in (you may unsubscribe anytime).",
          "Comply with legal obligations and enforce our Terms.",
          "Analytics to understand site performance (with consent where required).",
        ],
      },
      {
        id: "legal-bases",
        title: "5. Legal bases (GDPR)",
        paragraphs: p(
          "Where GDPR applies, we process personal data based on: (a) contract performance (orders, accounts); (b) legitimate interests (security, analytics, product improvement) balanced against your rights; (c) consent (non-essential cookies, marketing); and (d) legal obligation."
        ),
      },
      {
        id: "sharing",
        title: "6. How we share information",
        list: [
          "Vendors: order and delivery details needed to fulfill your purchase.",
          "Payment processors (e.g., Stripe) for payment processing and tax calculation.",
          "Shipping carriers for delivery.",
          "Service providers: hosting, email, analytics (under data processing agreements).",
          "Creators: aggregated or attributed sale data as needed for commission payouts.",
          "Legal authorities when required by law or to protect rights and safety.",
          "Business transfers: in connection with a merger, acquisition, or asset sale, with notice where required.",
        ],
        paragraphs: p("We do not sell your personal information for money. We do not share personal information for cross-context behavioral advertising without consent where prohibited by law."),
      },
      {
        id: "retention",
        title: "7. Data retention",
        paragraphs: p(
          "We retain personal information as long as needed to provide services, comply with legal obligations (e.g., tax and accounting records), resolve disputes, and enforce agreements. Order and tax records are typically retained for seven (7) years unless a longer period is required by law."
        ),
      },
      {
        id: "rights",
        title: "8. Your privacy rights",
        list: [
          "Access, correction, and deletion of your personal information.",
          "Data portability (GDPR) in a structured, commonly used format.",
          "Restrict or object to certain processing (GDPR).",
          "Withdraw consent where processing is consent-based.",
          "Opt out of marketing emails via unsubscribe links.",
          "Lodge a complaint with your local data protection authority (EU/UK).",
        ],
        paragraphs: p(
          `To exercise rights, email ${companyLegal.privacyEmail}. We will verify your request and respond within applicable timelines (e.g., 30 days under GDPR, 45 days under CCPA).`
        ),
      },
      {
        id: "ccpa",
        title: "9. California residents (CCPA/CPRA)",
        paragraphs: p(
          "California residents have the right to know categories of personal information collected, request deletion, correct inaccurate information, and opt out of sale/sharing for cross-context behavioral advertising. We honor Global Privacy Control (GPC) signals where technically feasible.",
          `Submit requests to ${companyLegal.privacyEmail}. We will not discriminate against you for exercising privacy rights.`
        ),
      },
      {
        id: "international",
        title: "10. International transfers",
        paragraphs: p(
          "We may process data in the United States and other countries. Where required, we use appropriate safeguards such as Standard Contractual Clauses for transfers from the EEA/UK."
        ),
      },
      {
        id: "children",
        title: "11. Children",
        paragraphs: p(
          "Our services are not directed to children under 16. We do not knowingly collect personal information from children. Contact us if you believe we have collected a child's information."
        ),
      },
      {
        id: "changes-privacy",
        title: "12. Changes",
        paragraphs: p(
          "We may update this Privacy Policy. Material changes will be posted here with a revised date."
        ),
      },
    ],
  },

  cookies: {
    intro: p(
      "This Cookie Policy explains how FOSLOne uses cookies and similar technologies (pixels, local storage) on our websites and storefronts.",
      "You can manage preferences via our cookie banner or your browser settings."
    ),
    sections: [
      {
        id: "what",
        title: "1. What are cookies?",
        paragraphs: p(
          "Cookies are small text files stored on your device. They help sites remember your session, keep items in your cart, and understand how visitors use the site."
        ),
      },
      {
        id: "categories",
        title: "2. Cookie categories",
        list: [
          "Strictly necessary: required for security, checkout, cart persistence, and account login. These cannot be disabled on our site without breaking core functionality.",
          "Analytics: help us measure traffic and improve performance (e.g., page views, funnels). Used only with your consent where required.",
          "Marketing: used for Creator attribution, referral tracking, and campaign measurement. Domain-scoped and used only with your consent where required.",
        ],
      },
      {
        id: "examples",
        title: "3. Examples we use",
        list: [
          "Session and cart cookies — keep items in your cart across pages.",
          "Authentication cookies — maintain logged-in state on the Hub.",
          "fosl_cookie_consent — stores your cookie preference choices.",
          "Creator attribution cookies — last-click referral for commission (typically 30 days, domain-scoped).",
          "Analytics identifiers — optional, consent-based usage measurement.",
        ],
      },
      {
        id: "manage",
        title: "4. Managing cookies",
        paragraphs: p(
          "Use the cookie banner to accept necessary cookies only or enable analytics/marketing. You may also block or delete cookies in your browser; note that strictly necessary cookies are required for checkout.",
          "To reset preferences, clear site data for this domain or delete the fosl_cookie_consent entry in local storage."
        ),
      },
      {
        id: "third-party",
        title: "5. Third-party cookies",
        paragraphs: p(
          "Payment providers (e.g., Stripe) may set cookies during checkout. Their use is governed by their privacy policies. We minimize third-party scripts and load them only when needed."
        ),
      },
      {
        id: "contact-cookies",
        title: "6. Contact",
        paragraphs: p(`Questions: ${companyLegal.privacyEmail}`),
      },
    ],
  },

  returns: {
    intro: p(
      "This Returns & Refunds Policy explains how returns, exchanges, and refunds work for purchases on FOSLOne storefronts and marketplace.",
      "Policies may vary slightly by Vendor; the product page and order confirmation are authoritative when they specify additional terms."
    ),
    sections: [
      {
        id: "physical",
        title: "1. Physical products",
        list: [
          "Return window: 30 days from delivery unless a product page states otherwise.",
          "Items must be unused, in original packaging, and include all accessories.",
          "Defective or incorrect items: contact support within 14 days for prepaid return label where applicable.",
          "Final sale items (clearly marked) are not returnable unless defective.",
          "Return shipping: customer pays return shipping unless the return is due to our or the Vendor's error.",
        ],
      },
      {
        id: "digital-returns",
        title: "2. Digital products",
        paragraphs: p(
          "Due to the nature of digital goods, all sales are generally final once download or access is delivered, except where required by law or if the file is materially defective or inaccessible. Contact support within 14 days if you cannot access your purchase."
        ),
      },
      {
        id: "lead-gen-returns",
        title: "3. Consultations & lead-generation",
        paragraphs: p(
          "Free consultations may be cancelled per the scheduling terms on the product page. Paid consultations: cancel at least 24 hours before the appointment for a full refund unless otherwise stated. No-shows may not be refundable."
        ),
      },
      {
        id: "process",
        title: "4. How to request a return",
        list: [
          "Email " + companyLegal.supportEmail + " with your order number and reason for return.",
          "Wait for return authorization and instructions (RMA) before shipping items back.",
          "Unauthorized returns may not be accepted or refunded.",
        ],
      },
      {
        id: "refunds",
        title: "5. Refunds",
        paragraphs: p(
          "Approved refunds are issued to the original payment method within 5–10 business days after we receive and inspect returned goods. Shipping charges are non-refundable except for defective or incorrect orders. Partial refunds may apply for damaged items returned in used condition."
        ),
      },
      {
        id: "chargebacks",
        title: "6. Chargebacks",
        paragraphs: p(
          "Please contact us before initiating a chargeback so we can resolve the issue. Unwarranted chargebacks may result in account suspension."
        ),
      },
    ],
  },

  shipping: {
    intro: p(
      "This Shipping Policy describes how physical orders are fulfilled on FOSLOne.",
      sharedMarketplace
    ),
    sections: [
      {
        id: "fulfillment",
        title: "1. Fulfillment",
        paragraphs: p(
          "Each Vendor ships from their own location. Multi-vendor orders may arrive in separate packages with separate tracking numbers."
        ),
      },
      {
        id: "methods",
        title: "2. Shipping methods & costs",
        paragraphs: p(
          "Available methods and costs are shown at checkout per Vendor (e.g., standard, expedited). Digital products and lead-generation offers do not require shipping."
        ),
      },
      {
        id: "processing",
        title: "3. Processing times",
        list: [
          "Most orders ship within 1–3 business days unless stated otherwise on the product page.",
          "Custom or made-to-order items may require additional lead time.",
          "You will receive a shipping confirmation email with tracking when available.",
        ],
      },
      {
        id: "delivery",
        title: "4. Delivery estimates",
        paragraphs: p(
          "Delivery estimates are provided by carriers and are not guaranteed. Delays due to weather, customs, or carrier issues are outside our control. Contact support if your order is significantly delayed."
        ),
      },
      {
        id: "international-shipping",
        title: "5. International shipping",
        paragraphs: p(
          "International orders may be subject to customs duties, taxes, and fees collected by the destination country. These are the buyer's responsibility unless stated otherwise at checkout."
        ),
      },
      {
        id: "lost",
        title: "6. Lost or damaged packages",
        paragraphs: p(
          `Report lost or damaged shipments within 14 days of the estimated delivery date to ${companyLegal.supportEmail}. We will work with the Vendor and carrier to resolve the issue, which may include replacement or refund.`
        ),
      },
    ],
  },

  "creator-terms": {
    intro: p(
      "These Creator Program Terms govern participation in the FOSLOne Creator program. By signing up as a Creator or generating referral links, you agree to these terms in addition to our Terms of Service and Privacy Policy."
    ),
    sections: [
      {
        id: "program",
        title: "1. Program overview",
        paragraphs: p(
          "Creators promote Vendor products using trackable links and earn commissions on qualifying sales attributed to their referrals."
        ),
      },
      {
        id: "attribution",
        title: "2. Attribution & cookies",
        list: [
          "Last-click attribution within a 30-day cookie window unless otherwise stated in your dashboard.",
          "Cookies are domain-scoped to FOSLOne properties.",
          "Self-referrals and fraudulent traffic are not eligible for commission.",
          "We use reasonable fraud detection; suspicious activity may be withheld pending review.",
        ],
      },
      {
        id: "commissions",
        title: "3. Commissions & payouts",
        list: [
          "Commission rates are shown per product or campaign in the Creator hub.",
          "Commissions apply to net product price excluding tax and shipping unless stated otherwise.",
          "Payouts are processed on a scheduled basis (e.g., monthly) once you meet the minimum payout threshold.",
          "Chargebacks and refunded orders may reverse associated commissions.",
        ],
      },
      {
        id: "conduct",
        title: "4. Creator conduct",
        list: [
          "Disclose affiliate relationships as required by FTC and local advertising rules.",
          "Do not use spam, misleading claims, or trademark bidding without permission.",
          "Do not promote prohibited products listed in our Acceptable Use Policy.",
        ],
      },
      {
        id: "termination",
        title: "5. Suspension & termination",
        paragraphs: p(
          "We may suspend or terminate Creator accounts for policy violations, fraud, or inactivity. Earned commissions for valid sales prior to termination will be paid subject to review."
        ),
      },
    ],
  },

  "vendor-terms": {
    intro: p(
      "These Seller & Vendor Terms apply to businesses and individuals listing products on the FOSLOne marketplace or incubated storefronts."
    ),
    sections: [
      {
        id: "listing",
        title: "1. Listings & accuracy",
        list: [
          "You are responsible for accurate titles, descriptions, images, pricing, and inventory.",
          "Products must comply with all applicable laws (safety, labeling, export, consumer protection).",
          "Prohibited items are listed in our Acceptable Use Policy.",
        ],
      },
      {
        id: "fulfillment-vendor",
        title: "2. Fulfillment & customer service",
        paragraphs: p(
          "You must ship orders within stated processing times and respond to buyer inquiries in a timely manner. You are the seller of record for your products."
        ),
      },
      {
        id: "fees",
        title: "3. Fees & payouts",
        paragraphs: p(
          "Platform fees, payment processing fees, and payout schedules are defined in your vendor agreement or dashboard. FOSLOne may withhold payouts for disputed orders, chargebacks, or policy violations."
        ),
      },
      {
        id: "tax",
        title: "4. Taxes",
        paragraphs: p(
          "You are responsible for determining and remitting applicable taxes on your sales where required. We may collect and remit sales tax via Stripe Tax where enabled."
        ),
      },
      {
        id: "ip-vendor",
        title: "5. Intellectual property",
        paragraphs: p(
          "You warrant that your listings do not infringe third-party rights. You grant FOSLOne a license to display listing content for marketing the marketplace."
        ),
      },
    ],
  },

  "acceptable-use": {
    intro: p(
      "This Acceptable Use Policy describes prohibited conduct on FOSLOne platforms. Violations may result in content removal, account suspension, or legal action."
    ),
    sections: [
      {
        id: "prohibited",
        title: "1. Prohibited activities",
        list: [
          "Illegal goods or services, including counterfeit products, stolen goods, or controlled substances.",
          "Weapons, explosives, or hazardous materials where prohibited by law or platform policy.",
          "Hate speech, harassment, threats, or content promoting violence or discrimination.",
          "Sexually explicit content involving minors; any CSAM is reported to authorities.",
          "Malware, phishing, or attempts to compromise platform security.",
          "Scraping, automated abuse, or circumventing rate limits without permission.",
          "Fake reviews, click fraud, or manipulation of Creator attribution.",
          "Infringement of intellectual property, privacy, or publicity rights.",
        ],
      },
      {
        id: "enforcement",
        title: "2. Enforcement",
        paragraphs: p(
          `Report violations to ${companyLegal.legalEmail}. We investigate reports and may cooperate with law enforcement.`
        ),
      },
    ],
  },

  accessibility: {
    intro: p(
      `${companyLegal.name} is committed to making our digital experiences accessible to people with disabilities. We aim to conform to WCAG 2.1 Level AA where practicable.`
    ),
    sections: [
      {
        id: "measures",
        title: "1. Accessibility measures",
        list: [
          "Semantic HTML and keyboard navigable interfaces.",
          "Sufficient color contrast for text and interactive elements.",
          "Alternative text for meaningful images.",
          "Form labels and error messages associated with inputs.",
          "Responsive layouts that support zoom up to 200%.",
        ],
      },
      {
        id: "ongoing",
        title: "2. Ongoing efforts",
        paragraphs: p(
          "We regularly review pages and components for accessibility improvements. Third-party content (e.g., embedded payment widgets) may be governed by the provider's accessibility statements."
        ),
      },
      {
        id: "feedback",
        title: "3. Feedback & assistance",
        paragraphs: p(
          `If you encounter accessibility barriers, contact ${companyLegal.supportEmail} with the page URL and description of the issue. We will work to provide the information or functionality you need.`
        ),
      },
    ],
  },
};
