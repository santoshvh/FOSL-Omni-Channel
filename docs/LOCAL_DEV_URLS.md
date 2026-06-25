# FOSL Local Dev URLs

Quick reference for running and browsing the Phase A prototype locally.

## Start servers

From the repo root (`e:\Code\MV FOSL 2`):

```powershell
npm run dev:platform     # port 3000 (workspaces + /admin)
npm run dev:storefront   # port 3001
```

Use **two terminals** (one per app).

## Database (Phase B)

Configure MySQL in **Platform → Admin → Settings** (http://localhost:3000/admin/settings): host, port, database, user, password. Saving writes `.fosl-runtime.json` at the repo root — **restart both dev servers** after saving.

For first-time setup before Admin is configured, you may set `DATABASE_URL` in `.env`:

```powershell
cp .env.example .env
npm run db:setup
```

```powershell
# Production / shared environments — versioned migrations
npm run db:migrate:deploy
npm run db:seed
```

Hub auth, Stripe, email, API mocking, and storefront subscription state are also managed in Admin Settings (not `.env`).

Demo logins (password `demo123`):

| Email | Roles |
|-------|-------|
| `alex@acmecatalog.com` | vendor, creator, operator |
| `vendor@demo.fosl` | vendor |
| `creator@demo.fosl` | creator |
| `operator@demo.fosl` | operator |

Password reset (Hub): http://localhost:3000/auth/forgot-password — emails use the provider configured in Admin Settings (console in dev by default).

Verify Prisma products: `GET http://localhost:3001/api/v1/products` → `"source": "database"` when DB is up.

### Image uploads (Hub)

Configure **File storage** in Admin Settings:

- **Local** — saves to the configured directory (default repo-root `uploads/`). Served at `http://localhost:3000/api/v1/uploads/<filename>`.
- **S3** — uploads to your bucket; returns the public URL (CDN prefix or default S3 URL). Bucket must allow public read on `uploads/*` or use a CloudFront prefix.

### Stripe webhooks (optional)

With Stripe keys configured in Admin Settings and [Stripe CLI](https://stripe.com/docs/stripe-cli) installed:

```powershell
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

Copy the `whsec_...` signing secret into Admin Settings → Stripe webhook secret, save, and restart `dev:storefront`.

### Creator attribution (optional)

1. Open http://localhost:3001/products/prod_1 and accept **Marketing** cookies in the banner.
2. Visit a referral URL, e.g. http://localhost:3001/products/prod_1?ref=CREATOR_ALEX
3. Add to cart and complete checkout — `POST /api/v1/orders` returns `"attributed": true` and `commissionCount` when DB is up.

Re-seed after pulling: `npm run db:seed` (creates `CREATOR_ALEX` link for Alex Rivera).

### Commission payouts (optional)

After a referred checkout, commissions move to `CLEARED`. Run the payout job:

```powershell
npm run jobs:payout-commissions
```

Set the payout job secret in Admin Settings for production; locally the job works without it when `NODE_ENV` is not `production`.

Order confirmation emails use the provider configured in Admin Settings.

### E2E tests (Playwright)

```powershell
npm run build -w @fosl/storefront
npm run test:e2e
```

Install browsers once: `npm run test:e2e:install`

## Base URLs

| App | Local | Purpose |
|-----|-------|---------|
| **Platform** | http://localhost:3000 | Vendor, Creator, Operator workspaces |
| **Storefront** | http://localhost:3001 | Customer shop + FOSLOne home + marketplace |
| **Admin** | http://localhost:3000/admin | Platform admin (same app as platform) |

---

## Storefront — http://localhost:3001

### FOSLOne & operator storefront

| Screen | URL |
|--------|-----|
| Home | http://localhost:3001/ |
| Products | http://localhost:3001/products |
| Product detail (sample) | http://localhost:3001/products/prod_1 |
| Cart | http://localhost:3001/cart |
| Checkout | http://localhost:3001/checkout |
| Confirmation (mixed) | http://localhost:3001/checkout/confirmation?type=mixed |
| Confirmation (physical) | http://localhost:3001/checkout/confirmation?type=physical |
| Confirmation (digital) | http://localhost:3001/checkout/confirmation?type=digital |
| Confirmation (lead gen) | http://localhost:3001/checkout/confirmation?type=lead_gen |
| Orders | http://localhost:3001/orders |
| Order detail (sample) | http://localhost:3001/orders/ord_1 |
| Incubations | http://localhost:3001/incubations |
| Creator support | http://localhost:3001/creator-support |
| Contact | http://localhost:3001/contact |
| Suspended storefront | http://localhost:3001/suspended |

### Vendor stores (path-based)

| Vendor | URL |
|--------|-----|
| Acme Audio Co. | http://localhost:3001/acme-audio |
| Bright Labs | http://localhost:3001/bright-labs |
| Creator Academy | http://localhost:3001/creator-academy |
| Northwind Growth | http://localhost:3001/northwind-growth |

### Marketplace

| Screen | URL |
|--------|-----|
| Marketplace home | http://localhost:3001/marketplace |
| Search | http://localhost:3001/marketplace/search?q=headphones |
| Category (electronics) | http://localhost:3001/marketplace/category/electronics |
| Product detail (sample) | http://localhost:3001/marketplace/products/prod_1 |
| Vendor profile (sample) | http://localhost:3001/marketplace/vendors/ven_1 |
| Cart | http://localhost:3001/marketplace/cart |
| Checkout | http://localhost:3001/marketplace/checkout |
| Confirmation | http://localhost:3001/marketplace/checkout/confirmation |
| Orders | http://localhost:3001/marketplace/orders |

---

## Platform — http://localhost:3000

Use the **role switcher** in the header to move between Vendor, Creator, and Operator.

### Auth & account

| Screen | URL |
|--------|-----|
| Role landing | http://localhost:3000/auth/landing |
| Sign in | http://localhost:3000/auth/sign-in |
| Register | http://localhost:3000/auth/register |
| Forgot password | http://localhost:3000/auth/forgot-password |
| Reset password | http://localhost:3000/auth/reset-password |
| Account | http://localhost:3000/account |
| Edit account | http://localhost:3000/account/edit |
| Notifications | http://localhost:3000/notifications |

### Vendor

| Screen | URL |
|--------|-----|
| Dashboard | http://localhost:3000/vendor |
| Catalog | http://localhost:3000/vendor/catalog |
| Catalog source | http://localhost:3000/vendor/catalog/source |
| New product | http://localhost:3000/vendor/catalog/new |
| Edit product (sample) | http://localhost:3000/vendor/catalog/prod_1 |
| Integrations | http://localhost:3000/vendor/integrations |
| Connect integration | http://localhost:3000/vendor/integrations/connect |
| Sync history | http://localhost:3000/vendor/integrations/history |
| Sync job detail (sample) | http://localhost:3000/vendor/integrations/history/sync_1 |
| Shipping | http://localhost:3000/vendor/shipping |
| Operator relationships | http://localhost:3000/vendor/relationships |
| Orders | http://localhost:3000/vendor/orders |
| Order detail (sample) | http://localhost:3000/vendor/orders/ord_1 |
| Coupons | http://localhost:3000/vendor/coupons |
| New coupon | http://localhost:3000/vendor/coupons/new |
| Campaigns | http://localhost:3000/vendor/campaigns |
| Payouts | http://localhost:3000/vendor/payouts |
| Analytics | http://localhost:3000/vendor/analytics |

### Creator

| Screen | URL |
|--------|-----|
| Dashboard | http://localhost:3000/creator |
| Referral links | http://localhost:3000/creator/links |
| Collections | http://localhost:3000/creator/collections |
| New collection | http://localhost:3000/creator/collections/new |
| Collection detail (sample) | http://localhost:3000/creator/collections/col_1 |
| Coupons | http://localhost:3000/creator/coupons |
| New coupon | http://localhost:3000/creator/coupons/new |
| Analytics | http://localhost:3000/creator/analytics |
| Referral tree | http://localhost:3000/creator/referral-tree |
| Public profile | http://localhost:3000/creator/profile |
| Earnings | http://localhost:3000/creator/payouts |

### Operator

| Screen | URL |
|--------|-----|
| Dashboard | http://localhost:3000/operator |
| Catalog | http://localhost:3000/operator/catalog |
| New product | http://localhost:3000/operator/catalog/new |
| Edit product (sample) | http://localhost:3000/operator/catalog/prod_1 |
| Import from vendors | http://localhost:3000/operator/catalog/import |
| Vendors | http://localhost:3000/operator/vendors |
| Invite vendor | http://localhost:3000/operator/vendors/invite |
| Vendor detail (sample) | http://localhost:3000/operator/vendors/ven_1 |
| Creators | http://localhost:3000/operator/creators |
| Invite creator | http://localhost:3000/operator/creators/invite |
| Orders | http://localhost:3000/operator/orders |
| Order detail (sample) | http://localhost:3000/operator/orders/ord_1 |
| Coupons | http://localhost:3000/operator/coupons |
| New coupon | http://localhost:3000/operator/coupons/new |
| Commissions | http://localhost:3000/operator/commissions |
| Promotions | http://localhost:3000/operator/promotions |
| New promotion | http://localhost:3000/operator/promotions/new |
| Analytics | http://localhost:3000/operator/analytics |
| Payouts | http://localhost:3000/operator/payouts |
| Domains | http://localhost:3000/operator/domains |
| Lead gen | http://localhost:3000/operator/lead-gen |
| Storefront settings | http://localhost:3000/operator/storefront |
| Subscription | http://localhost:3000/operator/subscription |

---

## Admin — http://localhost:3000/admin

| Screen | URL |
|--------|-----|
| Dashboard | http://localhost:3000/admin |
| Operators | http://localhost:3000/admin/operators |
| Operator detail (sample) | http://localhost:3000/admin/operators/op_1 |
| Edit operator (sample) | http://localhost:3000/admin/operators/op_1/edit |
| Disputes | http://localhost:3000/admin/disputes |
| Dispute detail (sample) | http://localhost:3000/admin/disputes/disp_1 |
| Audit log | http://localhost:3000/admin/audit |
| Payments | http://localhost:3000/admin/payments |
| Settings | http://localhost:3000/admin/settings |
| Subscription plans | http://localhost:3000/admin/subscription-plans |
| Health | http://localhost:3000/admin/health |

Platform **Settings** (http://localhost:3000/admin/settings) is the single source of truth for database, app URLs, auth, API mocking, file storage, email, Stripe, jobs, and feature flags. Saves write `.fosl-runtime.json` — restart dev servers after saving. Persists to `platform_config` when MySQL is up; otherwise uses MSW mock storage.

---

## Troubleshooting

### Port already in use (`EADDRINUSE`)

```powershell
foreach ($port in 3000,3001) {
  Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
```

Then restart the dev servers.

### Storefront blank or 404 on `_next/static` chunks

1. Stop the storefront dev server.
2. Delete the build cache: `Remove-Item -Recurse -Force "apps\storefront\.next"`
3. Run `npm run dev:storefront` again.
4. Hard refresh the browser (`Ctrl+Shift+R`).

### Cross-app links

Storefront login points to the hub sign-in page. App URLs are configured in Admin Settings and exposed via `GET /api/v1/platform-config` on each app.

---

*See also: [WIREFRAME_INVENTORY.md](./WIREFRAME_INVENTORY.md) for screen status checklist.*
