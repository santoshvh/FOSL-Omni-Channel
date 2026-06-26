# FOSL Operator Self-Hosted Starter

Minimal static shop that loads catalog from FOSL using your **publishable key**.

## Setup

1. In **Hub → Operator → Storefronts & API keys**, copy your `pk_sf_…` key.
2. In **Hub → Operator → Domains**, add your site URL to **CORS allowed origins**.
3. Copy `config.example.js` to `config.js` and set values.
4. Serve this folder with any static host (ICDSoft, Netlify, S3, nginx).

## Files

| File | Purpose |
|------|---------|
| `config.example.js` | API base URL + publishable key |
| `index.html` | Product grid demo |
| `shop.js` | Fetch catalog from FOSL |

## DNS (optional custom domain on FOSL shop)

CNAME `shop.yourbrand.com` → `shop.foslone.com`, then set custom domain in Hub → Domains.

For fully self-hosted HTML (this kit), only CORS + publishable key are required.

## Checkout

Production checkout should call FOSL server-side or use the hosted shop checkout. This starter is catalog-only; extend `shop.js` with `POST /api/v1/checkout/payment-intent` when you add a backend.

See [API-REFERENCE.md](../docs/API-REFERENCE.md).
