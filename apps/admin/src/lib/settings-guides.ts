import type { SetupGuideStep, SetupGuideTerm } from "@fosl/ui";

export const databaseSetupGuide = {
  title: "MySQL setup",
  steps: [
    {
      title: "Install MySQL 8 locally or on ICDSoft",
      body: "Create an empty database (e.g. fosl_dev) and a user with full privileges on that database.",
    },
    {
      title: "Enter connection details",
      body: "Host is usually localhost or your ICDSoft MySQL hostname. Default port is 3306.",
    },
    {
      title: "Save and restart apps",
      body: "Saving writes DATABASE_URL to .fosl-runtime.json at the repo root. Restart hub, storefront, and admin dev servers.",
    },
    {
      title: "Apply schema",
      body: "From the repo root run npm run db:setup (first time) or npm run db:push after schema changes.",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "DATABASE_URL",
      definition: "Connection string Prisma uses. Built automatically from the fields above when you save.",
    },
  ] satisfies SetupGuideTerm[],
};

export const s3StorageGuide = {
  title: "Amazon S3 setup",
  steps: [
    {
      title: "Create or choose a bucket",
      body: "In AWS S3, create a bucket in the region closest to your users. Note the bucket name and region code (e.g. us-east-1).",
    },
    {
      title: "Create IAM access keys",
      body: "IAM → Users → Create user with programmatic access. Attach a policy allowing s3:PutObject and s3:GetObject on uploads/* in your bucket.",
    },
    {
      title: "Set public URL prefix (optional)",
      body: "If you use CloudFront or a custom CDN domain, enter it as https://cdn.example.com/. Otherwise FOSL uses the default S3 virtual-hosted URL.",
    },
    {
      title: "Allow public read on uploads",
      body: "Product images are served directly from S3/CDN. Ensure objects under uploads/ are publicly readable or fronted by CloudFront.",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "Bucket",
      definition: "S3 container where FOSL stores files at uploads/{uuid}.{ext}.",
    },
    {
      term: "Public URL prefix",
      definition: "Base URL prepended to each uploaded file path — use your CDN domain in production.",
    },
  ] satisfies SetupGuideTerm[],
};

export const postmarkEmailGuide = {
  title: "Postmark setup",
  steps: [
    {
      title: "Create a Postmark server",
      body: "Sign up at postmarkapp.com and add a Server for transactional email.",
    },
    {
      title: "Verify sender signature",
      body: "Add and verify the From address you’ll use (e.g. orders@foslone.com) under Sender Signatures.",
    },
    {
      title: "Copy server token",
      body: "Under the server’s API Tokens tab, copy the Server API token into the field below.",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "Server token",
      definition: "Secret used to send mail via Postmark’s API. Distinct from your account API key.",
    },
  ] satisfies SetupGuideTerm[],
};

export const resendEmailGuide = {
  title: "Resend setup",
  steps: [
    {
      title: "Create a Resend account",
      body: "Sign up at resend.com and add your sending domain.",
    },
    {
      title: "Verify DNS records",
      body: "Add the SPF/DKIM records Resend provides so your From address can send reliably.",
    },
    {
      title: "Create API key",
      body: "API Keys → Create API Key with “Sending access”. Paste the key starting with re_ below.",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "API key",
      definition: "Bearer token Resend uses to authenticate send requests from FOSL.",
    },
  ] satisfies SetupGuideTerm[],
};

export const stripeSetupGuide = {
  title: "Stripe setup",
  steps: [
    {
      title: "Use test mode first",
      body: "In Stripe Dashboard toggle Test mode. Copy test keys (sk_test_… and pk_test_…) for development.",
    },
    {
      title: "Enable Connect",
      body: "Settings → Connect → Get started. FOSL uses Connect for vendor and creator payouts.",
    },
    {
      title: "Create a webhook endpoint",
      body: "Developers → Webhooks → Add endpoint pointing to https://your-storefront/api/webhooks/stripe. Subscribe to payment_intent.succeeded and related events.",
    },
    {
      title: "Copy webhook signing secret",
      body: "After creating the endpoint, reveal the signing secret (whsec_…) and paste it below.",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "Secret key (sk_)",
      definition: "Server-side key for creating PaymentIntents and Connect transfers. Never expose in the browser.",
    },
    {
      term: "Publishable key (pk_)",
      definition: "Client-side key loaded by the storefront Payment Element.",
    },
    {
      term: "Webhook secret (whsec_)",
      definition: "Verifies that payment events really came from Stripe.",
    },
    {
      term: "Stripe Connect",
      definition: "Lets vendors and creators receive their share of each order into connected accounts.",
    },
  ] satisfies SetupGuideTerm[],
};

export const authSetupGuide = {
  title: "Hub authentication",
  steps: [
    {
      title: "Generate an auth secret",
      body: "Run openssl rand -base64 32 (or any 32+ byte random string). Paste it in Auth secret below.",
    },
    {
      title: "Set Auth URL",
      body: "Must match the public Hub URL (e.g. http://localhost:3000 in dev). Auth.js uses this for callbacks.",
    },
    {
      title: "Enable and restart",
      body: "Check “Enable Hub route protection”, save, then restart the Hub dev server so AUTH_SECRET loads from .fosl-runtime.json.",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "AUTH_SECRET",
      definition: "Encrypts session cookies. Required whenever auth is enabled.",
    },
  ] satisfies SetupGuideTerm[],
};
