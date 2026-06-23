import type { SetupGuideStep, SetupGuideTerm } from "@fosl/ui";

export const shopifyIntegrationGuide = {
  title: "How to connect Shopify",
  steps: [
    {
      title: "Open Shopify admin",
      body: "Log in at admin.shopify.com and select the store you want to connect.",
    },
    {
      title: "Create a custom app",
      body: "Go to Settings → Apps and sales channels → Develop apps → Create an app. Name it “FOSL Hub” or similar.",
    },
    {
      title: "Configure Admin API scopes",
      body: "Under Configuration → Admin API integration, enable read_products, read_inventory, read_shipping, read_orders, and write_orders. Save the app.",
    },
    {
      title: "Install and copy the access token",
      body: "Install the app on your store, then reveal the Admin API access token. Copy it immediately — Shopify only shows it once.",
    },
    {
      title: "Enter your myshopify.com URL",
      body: "Use your-store.myshopify.com (not your custom storefront domain). Example: acme-audio.myshopify.com.",
    },
    {
      title: "Run the first sync",
      body: "Keep “Sync shipping zones and rates” enabled so checkout can offer the same methods as your Shopify store.",
    },
    {
      title: "Add order status webhooks (recommended)",
      body: "In Shopify admin → Settings → Notifications → Webhooks, create webhooks for Order update and Order fulfillment pointing to your Hub URL: /api/webhooks/shopify/orders. Set SHOPIFY_WEBHOOK_SECRET in your environment to verify signatures.",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "Admin API access token",
      definition: "Secret key that lets FOSL read products, inventory, and shipping from Shopify on your behalf.",
    },
    {
      term: "myshopify.com domain",
      definition: "Shopify’s permanent admin hostname. Custom domains (e.g. shop.example.com) are not used for API calls.",
    },
    {
      term: "Sync interval",
      definition: "How often FOSL pulls updates from Shopify. Minimum 15 minutes to respect platform rate limits.",
    },
    {
      term: "Shipping zones",
      definition: "Regional groups in Shopify (e.g. US Domestic) that contain rate names and prices imported into FOSL checkout.",
    },
  ] satisfies SetupGuideTerm[],
  note: "In local development you can connect with any store URL to run a demo sync without live Shopify credentials.",
};

export const woocommerceIntegrationGuide = {
  title: "How to connect WooCommerce",
  steps: [
    {
      title: "Open WordPress admin",
      body: "Log in to the site where WooCommerce is installed (wp-admin).",
    },
    {
      title: "Create REST API keys",
      body: "Go to WooCommerce → Settings → Advanced → REST API → Add key.",
    },
    {
      title: "Set key permissions",
      body: "Description: “FOSL Hub”. User: an Administrator account. Permissions: Read/Write (needed for order push-back later). Click Generate API key.",
    },
    {
      title: "Copy consumer key and secret",
      body: "Copy both values right away. The consumer secret is only shown once. Paste them into the fields on this page.",
    },
    {
      title: "Enter your store URL",
      body: "Use the public site URL without a trailing slash — e.g. shop.example.com or https://shop.example.com. This is where WooCommerce REST lives at /wp-json/wc/v3/.",
    },
    {
      title: "Confirm HTTPS and permalinks",
      body: "Your site should use HTTPS in production. Under Settings → Permalinks, use any option except “Plain” so REST routes work.",
    },
    {
      title: "Enable shipping sync (recommended)",
      body: "FOSL imports zones from WooCommerce → Settings → Shipping. Flat rate, free shipping, and table-rate plugins appear as checkout options when exposed via REST.",
    },
    {
      title: "Add order status webhooks (recommended)",
      body: "In WooCommerce → Settings → Advanced → Webhooks, add an Order updated webhook to your Hub URL: /api/webhooks/woocommerce/orders. Set WOOCOMMERCE_WEBHOOK_SECRET in your environment to verify signatures.",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "Consumer key / Consumer secret",
      definition: "Pair of REST API credentials WooCommerce generates. Think of them as username and password for machine-to-machine access.",
    },
    {
      term: "Store URL",
      definition: "The hostname customers use to reach your WordPress shop. FOSL calls WooCommerce at /wp-json/wc/v3/ on this host.",
    },
    {
      term: "REST API",
      definition: "WooCommerce’s HTTP interface for products, stock, orders, and shipping. FOSL uses it instead of scraping your storefront.",
    },
    {
      term: "Sync shipping",
      definition: "When enabled, FOSL copies shipping zones and methods so multi-vendor checkout can quote the same rates as WooCommerce.",
    },
  ] satisfies SetupGuideTerm[],
  note: "Leave key fields empty in local dev to run a demo sync with sample catalog data.",
};

export const catalogSourceGuide = {
  title: "Choosing a catalog source",
  steps: [
    {
      title: "Native catalog",
      body: "Best if you don’t have Shopify or WooCommerce. You create products, images, inventory, and shipping rules directly in the Hub.",
    },
    {
      title: "Connected store",
      body: "Best if you already sell on Shopify or WooCommerce. FOSL syncs products, stock, and shipping on a schedule and can push orders back to your shop.",
    },
    {
      title: "Operator approval",
      body: "Regardless of source, an operator must approve your vendor relationship before SKUs appear on their storefront.",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "Catalog source",
      definition: "Whether products are managed on FOSL (native) or imported from an external platform (connected).",
    },
    {
      term: "Sync",
      definition: "A scheduled job that adds/updates products and shipping in FOSL to match your external store.",
    },
  ] satisfies SetupGuideTerm[],
};

export const integrationsListGuide = {
  title: "Managing integrations",
  steps: [
    {
      title: "Connect a store",
      body: "Use Connect store to link Shopify or WooCommerce. You’ll need API credentials from that platform’s admin.",
    },
    {
      title: "Sync now",
      body: "Runs an immediate pull of products and (if enabled) shipping. Scheduled syncs also run every 15+ minutes.",
    },
    {
      title: "Review sync history",
      body: "Open History to see added/updated/failed counts per run. Drill into a row for error details when status is partial or failed.",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "Products synced",
      definition: "Count of SKUs currently imported from this connection into FOSL for your vendor account.",
    },
    {
      term: "Shipping zones synced",
      definition: "Number of distinct shipping regions (e.g. US, EU) imported for checkout rate selection.",
    },
    {
      term: "Connected / Syncing / Error",
      definition: "Status of the link. Error usually means invalid credentials, blocked REST access, or a failed last sync.",
    },
  ] satisfies SetupGuideTerm[],
};

export const leadGenProductGuide = {
  title: "Lead-gen product setup",
  steps: [
    {
      title: "Choose form fields",
      body: "Select which fields appear on the storefront lead form. Name and email are typical requirements.",
    },
    {
      title: "Webhook URL (optional)",
      body: "HTTPS endpoint that receives a JSON POST when a lead is submitted — useful for Zapier, HubSpot, or a custom CRM.",
    },
    {
      title: "Notification email",
      body: "FOSL also emails this address when a lead arrives (uses the email provider configured in Admin Settings).",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "Lead-gen product",
      definition: "Replaces Add to cart with a contact form. No shipping; optional paid checkout if enabled.",
    },
    {
      term: "Webhook",
      definition: "Your server URL that FOSL calls in real time with lead payload { name, email, phone, … }.",
    },
  ] satisfies SetupGuideTerm[],
};

export const stripeConnectGuide = {
  title: "Stripe Connect for vendors",
  steps: [
    {
      title: "Complete Express onboarding",
      body: "FOSL uses Stripe Connect Express so you receive order payouts to your own bank account.",
    },
    {
      title: "Provide business and tax details",
      body: "Stripe will ask for legal name, address, and tax ID (or SSN for individuals). Required for payouts.",
    },
    {
      title: "Link a bank account",
      body: "Transfers arrive on your Connect payout schedule (typically weekly) after orders clear.",
    },
    {
      title: "Keep dashboard access",
      body: "Use Open Stripe Express to update bank info, view tax forms, and resolve any verification holds.",
    },
  ] satisfies SetupGuideStep[],
  terms: [
    {
      term: "Pending",
      definition: "Earnings from recent orders still in the clearance window before transfer.",
    },
    {
      term: "Cleared",
      definition: "Funds ready to be paid out to your connected bank account.",
    },
    {
      term: "Express account",
      definition: "Stripe-hosted onboarding — FOSL never stores your bank credentials.",
    },
  ] satisfies SetupGuideTerm[],
};
