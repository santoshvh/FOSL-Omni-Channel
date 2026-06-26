# FOSL Network Catalog & Multi-Operator Storefronts — Spec v1

**Status:** Implemented on `refactor/two-app-platform` (incremental)  
**Last updated:** June 2026

## 1. Vision

FOSL is a **shared commerce network**:

- **Vendors** are global (one catalog per vendor).
- **Operators** run independent storefronts and choose which vendors to sell.
- **Products** inherit from vendors (no per-operator product copies).
- **Creators** promote products with unique referral URLs across the network.
- **Marketplace** (`shop.foslone.com/marketplace`) shows the union of network-approved catalog.

## 2. Core entities

| Entity | Scope | Notes |
|--------|--------|--------|
| `Vendor` | Global | Owns products, Stripe, members |
| `Product` | Vendor | `vendorId`; published flag |
| `Operator` | Tenant | Subscription, owner user |
| `Storefront` | Per operator | `path` (e.g. `demo`), optional `customDomain` |
| `OperatorVendor` | Operator ↔ Vendor | `PENDING` / `APPROVED`; commission % |
| `CreatorProfile` | Global | One per user |
| `CreatorLink` | Creator + product (+ optional operator) | Unique `slug`, click count |
| `Order` | Per checkout | `storefrontId`, `operatorId`, `attributedCreatorLinkId` |

## 3. Vendor & product sharing

### Rules

1. A **vendor** exists once in the network.
2. An **operator** links to a vendor via `OperatorVendor`.
3. Mutual interest: link is `PENDING` until **approved** (`APPROVED`).
4. **Products** are visible to an operator iff:
   - `Product.published = true`, and
   - `OperatorVendor.status = APPROVED` for that operator + product’s vendor, and
   - `scope = CATALOG_WIDE` (SKU-level curation future).

### Catalog queries

| Query | Use case |
|-------|----------|
| `listNetworkProducts()` | Marketplace — vendors with any approved link |
| `listOperatorProducts(operatorId)` | Operator storefront — only that operator’s approved vendors |
| `areVendorsApprovedForOperator()` | Checkout validation |
| `getStorefrontByPath(path)` | Resolve operator from URL path |

### Storefront API

- `GET /api/v1/products?scope=network` — marketplace
- `GET /api/v1/products?scope=operator&storefrontPath={path}` — operator store catalog
- `GET /api/v1/products/[id]?scope=operator&storefrontPath={path}` — operator-scoped PDP data
- `GET /api/v1/storefronts/[path]` — storefront metadata

## 4. Multi-operator storefront URLs

| Store | URL |
|-------|-----|
| Operator 1 (demo) | `shop.foslone.com/demo` |
| Operator 2 (seed) | `shop.foslone.com/operator2` |
| Default operator shop | `shop.foslone.com/products` (default storefront) |
| Network marketplace | `shop.foslone.com/marketplace` |
| Vendor mini-store | `shop.foslone.com/{vendor-slug}` (when path is not an operator storefront) |

### Route resolution (`/[store]`)

1. If `{store}` matches a `Storefront.path` in DB → **operator storefront**
2. Else if `{store}` matches a vendor slug → **vendor mini-store** (mocks)

Operator product URLs: `/{storefrontPath}/products/{productId}`

## 5. Creator referral links

### Creation

`POST /api/v1/creator-links`

```json
{
  "productId": "prod_…",
  "referralCode": "ALEX2026",
  "storefrontPath": "demo"
}
```

- Persists `CreatorLink` with `productId`, `creatorId`, and `operatorId` (from storefront).
- URL format when scoped: `/{storefrontPath}/products/{productId}?ref={slug}`
- Network-wide (no path): `/marketplace/products/{productId}?ref={slug}`

### Identification

| Question | Answer |
|----------|--------|
| Which **product**? | `CreatorLink.productId` + slug + commission line filter |
| Which **creator**? | `CreatorLink.creatorId` |
| Which **operator** on link? | `CreatorLink.operatorId` (set when `storefrontPath` provided) |
| Which **operator** at purchase? | `Order.operatorId` + `Order.storefrontId` from checkout |

### Attribution flow

1. Customer visits `?ref={slug}` on operator or marketplace PDP
2. Cookie stores slug; `POST /api/v1/referral/click` increments clicks
3. Checkout sends `storefrontPath` → order gets correct `operatorId`
4. Creator link matched: `operatorId` null (network) OR matches checkout operator
5. Commissions on qualifying product lines

## 6. Platform (hub) APIs

- `GET /api/v1/operator-vendors` — list vendor relationships
- `PATCH /api/v1/operator-vendors/[id]` — approve / suspend
- `GET /api/v1/operator-catalog` — inherited products for operator

## 7. Non-goals (v1)

- Per-operator duplicate product rows
- Separate databases per operator
- SKU-level curation (`SKU_LEVEL` scope) — schema only
- Vendor portal accept/decline UI — operator approve only for now

## 8. Headless storefronts & API keys

Each `Storefront` has:

| Field | Purpose |
|-------|---------|
| `publishableKey` (`pk_sf_…`) | Browser / static shop — `Authorization: Bearer pk_sf_…` |
| `secretKeyHash` | Server-side integrations (rotate via hub) |
| `customDomain` | Resolve tenant from `Host` header |
| `allowedOrigins` | CORS allowlist for self-hosted shops |

### Resolve order

1. `Authorization: Bearer pk_sf_…`
2. `Host` → `customDomain`
3. `storefrontPath` query (legacy path routing)

### Headless endpoints (shop / future `api.*`)

| Endpoint | Notes |
|----------|--------|
| `GET /api/v1/products/search?q=` | Product search |
| `GET /api/v1/categories` | Network categories (DB) |
| `GET /api/v1/vendors` | Network vendors (DB) |
| `GET /api/v1/storefront/me` | Metadata from key or domain |
| `GET /api/v1/products?scope=operator` | Catalog when key/path resolves |
| `POST /api/v1/checkout/payment-intent` | Includes `storefrontPath`; uses operator Connect when configured |
| `POST /api/v1/orders` | `storefrontPath` for attribution |

Hub: `GET/POST /api/v1/operator/storefronts`, `POST /api/v1/operator/stripe-connect`.

## 9. Payments — Operator Connect (Model 1)

When `Operator.stripeConnectId` is set:

- Checkout charges the **operator Connect account** (operator MoR).
- **FOSL** takes `application_fee_amount` (default 10%).
- **Vendors** receive transfers from the operator balance on `payment_intent.succeeded`.
- **Creators** — commission rows in DB; payout job transfers (same as before).

When operator has **no** Connect account (marketplace / fallback):

- Legacy **platform MoR** — destination charge or multi-vendor settlement on platform balance.

Settlement metadata values: `operator_direct`, `operator_multi_vendor`, `destination`, `multi_vendor`, `platform`.
