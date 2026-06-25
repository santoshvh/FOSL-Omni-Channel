# FOSL Wireframe Inventory

High-fidelity Next.js prototype screens.

| App | URL |
|-----|-----|
| Hub | http://localhost:3000 |
| Storefront | http://localhost:3001 |
| Admin | http://localhost:3000/admin |

**Status: v0.21 — wireframe polish + catalog integrations (Shopify/WooCommerce)**

> Full roadmap, changelog, and next steps: [PROJECT_PLAN.md](./PROJECT_PLAN.md)

---

## Auth & account (Hub)

| Route | Status |
|-------|--------|
| `/auth/sign-in` | Done |
| `/auth/register` | Done |
| `/auth/forgot-password` | Done |
| `/auth/reset-password` | Done |
| `/auth/landing` | Done |
| `/account` | Done |
| `/account/edit` | Done |
| `/notifications` | Done |

---

## Storefront (Customer)

| ID | Screen | Route | Status |
|----|--------|-------|--------|
| S1 | Home | `/` | Done |
| S2 | Product listing (vendor filter, grid/list, **price range**) | `/products` | Done |
| S3a-c | Product detail | `/products/[id]` | Done |
| S4 | Cart | `/cart` | Done |
| S5-S7 | Checkout (contact/shipping/payment steps) | `/checkout` | Done |
| S8 | Confirmation (physical / digital / lead_gen variants) | `/checkout/confirmation?type=` | Done |
| S9 | Order history | `/orders` | Done |
| S10 | Order detail (timeline) | `/orders/[id]` | Done |
| S11 | Cookie consent | layout modal | Done |
| S12 | Storefront suspended | `/suspended` | Done |
| — | Contact | `/contact` | Done |
| — | Legal hub | `/legal`, `/legal/[slug]` | Done |
| — | Operator path storefront | `/[store]` | Done |

---

## Hub — Vendor

| Route | Status |
|-------|--------|
| `/vendor` | Done |
| `/vendor/catalog` | Done |
| `/vendor/catalog/source` | Done |
| `/vendor/catalog/new` | Done (physical dimensions, digital license pool, lead form builder) |
| `/vendor/catalog/[id]` | Done |
| `/vendor/integrations` | Done |
| `/vendor/integrations/connect` | Done |
| `/vendor/integrations/history` | Done |
| `/vendor/integrations/history/[id]` | Done |
| `/vendor/shipping` | Done |
| `/vendor/relationships` | Done |
| `/vendor/orders` | Done |
| `/vendor/orders/[id]` | Done |
| `/vendor/coupons` | Done |
| `/vendor/coupons/new` | Done |
| `/vendor/campaigns` | Done |
| `/vendor/payouts` | Done |
| `/vendor/analytics` | Done |

---

## Hub — Creator

| Route | Status |
|-------|--------|
| `/creator` | Done |
| `/creator/links` | Done |
| `/creator/collections` | Done |
| `/creator/collections/new` | Done |
| `/creator/collections/[id]` | Done |
| `/creator/coupons` | Done |
| `/creator/coupons/new` | Done |
| `/creator/analytics` | Done |
| `/creator/referral-tree` | Done |
| `/creator/profile` | Done |
| `/creator/payouts` | Done |

---

## Hub — Operator

| Route | Status |
|-------|--------|
| `/operator` | Done |
| `/operator/catalog` | Done |
| `/operator/catalog/new` | Done |
| `/operator/catalog/[id]` | Done |
| `/operator/catalog/import` | Done |
| `/operator/vendors` | Done |
| `/operator/vendors/invite` | Done |
| `/operator/vendors/[id]` | Done |
| `/operator/creators` | Done |
| `/operator/creators/invite` | Done |
| `/operator/orders` | Done |
| `/operator/orders/[id]` | Done |
| `/operator/coupons` | Done |
| `/operator/coupons/new` | Done |
| `/operator/commissions` | Done |
| `/operator/promotions` | Done |
| `/operator/promotions/new` | Done |
| `/operator/analytics` | Done |
| `/operator/payouts` | Done |
| `/operator/domains` | Done |
| `/operator/lead-gen` | Done |
| `/operator/storefront` | Done |
| `/operator/subscription` | Done |

---

## Admin

| Route | Status |
|-------|--------|
| `/` | Done |
| `/operators` | Done |
| `/operators/[id]` | Done |
| `/operators/[id]/edit` | Done |
| `/disputes` | Done |
| `/disputes/[id]` | Done |
| `/audit` | Done |
| `/payments` | Done |
| `/settings` | Done |
| `/subscription-plans` | Done |
| `/health` | Done |

---

## Master marketplace (fosl.com)

| ID | Screen | Route | Status |
|----|--------|-------|--------|
| H1 | Marketplace home | `/marketplace` | Done (search, categories, vendors, **product filters**) |
| H2 | Search results | `/marketplace/search` | Done |
| H3 | Product detail | `/marketplace/products/[id]` | Done |
| H4 | Vendor profile | `/marketplace/vendors/[id]` | Done |
| H5 | Cart (multi-vendor) | `/marketplace/cart` | Done |
| H6-H8 | Checkout (contact/shipping/payment/confirmation) | `/marketplace/checkout` | Done |
| H8 | Confirmation | `/marketplace/checkout/confirmation` | Done |
| H9 | Order history | `/marketplace/orders` | Done |
| H10 | Order detail | `/marketplace/orders/[id]` | Done |
| H11 | Category browse | `/marketplace/category/[slug]` | Done |

---

## Out of scope (deferred)

- Storybook component catalog
- Field-level wireframe PDF (routes implemented with inline validation)

## Phase B — catalog integrations (v0.21)

- `@fosl/integrations` — Shopify + WooCommerce adapters
- Hub `POST /api/v1/integrations`, `POST /api/v1/integrations/[id]/sync`
- `npm run jobs:sync-catalog` — cron-friendly sync script

## Phase A polish

### v0.8
- Contact form API (`POST /api/v1/contact`) + success state
- Loading skeletons (products, cart drawer, checkout)
- Products API route (`GET /api/v1/products`)

### v0.7
- FOSLOne.com image assets + stock hero background
- Legal pages (`/legal/*`) and footer/checkout compliance links
- Product card Buy now / View product actions
- Team section layout (equal cards, 2/3 + 1/3)

### v0.6

- Cart drawer + mobile bottom nav
- Product search autocomplete
- MSW wired in dev (`/api/v1/*`)
- PDP split: physical / digital / lead-gen
- Checkout, vendor product create, operator commissions field-level pass

---

*Total: 85+ screens implemented across storefront (incl. marketplace), hub, and admin*
