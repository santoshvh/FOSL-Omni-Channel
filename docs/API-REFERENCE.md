# FOSL Commerce API — Reference

Base URLs:

| Environment | Shop (UI + API) | Dedicated API |
|-------------|-----------------|---------------|
| Production | `https://shop.foslone.com` | `https://api.foslone.com` |
| Local | `http://localhost:3001` | `http://localhost:3002` |

Authenticate headless clients with:

```http
Authorization: Bearer pk_sf_…
```

Or resolve by custom domain (`Host` header) when DNS points at FOSL.

## Storefront

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/storefront/me` | Current storefront from key/domain |
| GET | `/api/v1/storefronts/{path}` | Storefront metadata by path |
| GET | `/api/v1/storefront/resolve-host?host=` | Public host lookup |

## Catalog

| Method | Path | Query |
|--------|------|-------|
| GET | `/api/v1/products` | `scope=network\|operator`, `storefrontPath` |
| GET | `/api/v1/products/{id}` | `scope`, `storefrontPath` |
| GET | `/api/v1/products/search` | `q=` |
| GET | `/api/v1/categories` | Network categories |
| GET | `/api/v1/vendors` | Network vendors |

## Checkout

| Method | Path | Body |
|--------|------|------|
| POST | `/api/v1/checkout/payment-intent` | `{ amountCents, email?, lines?, storefrontPath? }` |
| POST | `/api/v1/orders` | `createOrderSchema` + `storefrontPath` |
| POST | `/api/v1/creator-links` | `{ productId, referralCode, storefrontPath? }` |

## Payments

Operator Connect (Model 1) when `Operator.stripeConnectId` is set — see `docs/NETWORK-CATALOG-SPEC.md` §9.

Settlement values: `operator_direct`, `operator_multi_vendor`, `destination`, `multi_vendor`, `platform`.

## CORS

Register self-hosted origins in **Hub → Operator → Domains** (`allowedOrigins`). Preflight: `OPTIONS` on all catalog/checkout routes.

## Hub (tenant admin)

| Method | Path |
|--------|------|
| GET/POST | `/api/v1/operator/storefronts` |
| PATCH | `/api/v1/operator/storefronts/{id}` |
| GET/POST | `/api/v1/operator/stripe-connect` |

Dashboards and login: `https://hub.foslone.com` — shop links use `?callbackUrl=` + `?intent=creator|operator|vendor`.
