# FOSL Omni-Channel — Project Plan

Living document for scope, progress, changelog, and next steps.  
**Current release:** `v0.18` (MySQL 8, Admin platform settings) · **Last updated:** June 23, 2026 · **Repo:** [FOSL-Omni-Channel](https://github.com/santoshvh/FOSL-Omni-Channel)

| App | Port | Command |
|-----|------|---------|
| Hub | 3000 | `npm run dev:hub` |
| Storefront | 3001 | `npm run dev:storefront` |
| Admin | 3002 | `npm run dev:admin` |

See also: [WIREFRAME_INVENTORY.md](./WIREFRAME_INVENTORY.md) (screen list), [LOCAL_DEV_URLS.md](./LOCAL_DEV_URLS.md) (URLs), [DEPLOYMENT-ICDSOFT.md](./DEPLOYMENT-ICDSOFT.md) (hosting).

---

## 1. Phases (roadmap)

| Phase | Goal | Status |
|-------|------|--------|
| **A — UI prototype** | High-fidelity wireframes, mocks, FOSLOne branding, cart/checkout UX | **Complete** (v0.8) |
| **B — Backend** | Prisma schema, Auth.js, Stripe live, real APIs replacing MSW | **Mostly complete** (core APIs + auth landed) |
| **C — Production** | ICDSoft deploy, legal review, monitoring, vendor onboarding | **Started** (CI + E2E) |

---

## 2. Completed work

Use `[x]` for done, `[ ]` for open. Screen-level detail remains in [WIREFRAME_INVENTORY.md](./WIREFRAME_INVENTORY.md).

### 2.1 Foundation (v0.1) — `9394b3d`

- [x] Monorepo: `apps/hub`, `apps/storefront`, `apps/admin`, shared `packages/*`
- [x] 85+ wireframe screens across Hub (vendor / creator / operator), Storefront, Admin
- [x] Master marketplace routes under `/marketplace`
- [x] Mock data in `@fosl/mocks`, shared UI in `@fosl/ui`
- [x] Physical, digital, and lead-gen product types in catalog and PDP

### 2.2 FOSLOne branding & terminology (v0.2) — `e249dc1`

- [x] FOSLOne copy aligned with [foslone.com](https://www.foslone.com/)
- [x] **Creator** terminology (replaces Coseller in UI)
- [x] Path-based operator storefronts (`/[store]`)
- [x] FOSLOne marketing pages: home, incubations, creator-support, contact
- [x] Hub login links from storefront footer

### 2.3 Cart, mocks & rebrand (v0.6) — `1cf42d4`

- [x] **Cart drawer** + quantity stepper, remove, save-for-later
- [x] **Mobile bottom nav** on storefront
- [x] `cart-context` with localStorage persistence
- [x] **MSW** handlers wired in storefront, hub, and admin dev (`mockServiceWorker.js`)
- [x] **PDP split** summaries for physical / digital / lead-gen
- [x] **FOSL yellow rebrand** (`#FED318`), Plus Jakarta Sans, `FoslLogo`
- [x] Admin dark sidebar + dashboard chart polish
- [x] Field-level validation pass: checkout, vendor product create, operator commissions
- [x] `?vendor=` filter on product listing
- [x] Product search autocomplete (storefront)

### 2.4 Imagery, legal & storefront polish (v0.7) — `f6d1925`

- [x] **FOSLOne assets** from foslone.com → `public/foslone/` (hero, team, blog, seal, favicon, section SVGs)
- [x] **Stock hero background** (Pexels online-shopping) with gradient overlay
- [x] Homepage: audience cards, team grid (2/3 + 1/3 equal cards), featured blog, shop grid
- [x] **Buy now** + **View product** on all product catalog / marketplace cards (`ProductCardActions`)
- [x] **Legal suite** at `/legal` (9 policies — see §3.4)
- [x] Footer Legal column; cookie banner → Cookie Policy; checkout Terms/Privacy checkboxes
- [x] Digital PDP links to license terms; contact form privacy link
- [x] Site favicon via layout metadata

### 2.5 Screen inventory (Phase A)

- [x] Hub: auth, vendor, creator, operator workspaces (all routes in wireframe inventory)
- [x] Admin: operators, disputes, audit, payments, settings, health
- [x] Storefront: shop, cart, checkout, orders, marketplace, cookie consent, suspended
- [x] FOSLOne aux pages: contact, incubations, creator-support

### 2.6 Phase A finish (v0.8)

- [x] **Contact form** — `POST /api/v1/contact` with validation + success state
- [x] **Loading skeletons** — product catalog (API fetch), cart drawer (hydration), checkout steps
- [x] **Products API route** — `GET /api/v1/products` (MSW + Next.js route)
- [x] **Legacy route** — `/coseller-support` → `/creator-support` redirect
- [x] **`Skeleton` component** in `@fosl/ui`; `AlertBanner` success variant

### 2.7 Phase B — database (v0.9)

- [x] **`@fosl/db` package** — Prisma schema + client singleton
- [x] **Core models** — User, Operator, Storefront, Vendor, Product, Order, OrderLine, CreatorProfile, CreatorLink, Commission
- [x] **Auth.js-ready tables** — Account, Session, VerificationToken, UserRoleAssignment
- [x] **Supporting models** — ShippingMethod, VendorIntegration, OperatorVendor, Dispute, AuditLog, ContactSubmission
- [x] **Seed script** — loads fixtures from `@fosl/mocks`
- [x] **DB scripts** — `db:generate`, `db:push`, `db:seed`, `db:studio`, `db:migrate`
- [x] **Contact API** — persists to DB when `DATABASE_URL` is set
- [x] Auth.js integration (Hub)
- [x] Stripe Payment Element (mock fallback without keys; live when `STRIPE_SECRET_KEY` set)
- [x] Products API backed by Prisma (`GET /api/v1/products`)
- [x] Checkout API — `POST /api/v1/orders` persists `Order` + `OrderLine`

### 2.8 Phase B — Auth & APIs (v0.10)

- [x] **Auth.js (NextAuth v5)** — Hub credentials sign-in, JWT session with roles
- [x] **Edge-safe middleware** — `auth.config.ts` split; routes protected when `AUTH_SECRET` set
- [x] **Demo + DB auth** — `demo123` passwords; seed users with bcrypt when DB available
- [x] **Products API** — Prisma-backed catalog with mock fallback
- [x] **`POST /api/v1/orders`** — checkout creates Order + OrderLine; inventory decrement
- [x] **Stripe webhooks** — `POST /api/webhooks/stripe` (payment success/fail, refunds)
- [x] **Connect destination charges** — single-vendor carts route to vendor `stripeAccountId`
- [x] **Creator attribution** — `?ref=` cookie (marketing consent), commission ledger on order
- [x] **Commission payouts** — Stripe Connect transfers + `POST /api/v1/payouts/commissions`
- [x] **Order confirmation email** — Resend when configured; console fallback in dev
- [x] **Password reset email** — Hub forgot/reset flow with hashed tokens
- [x] **Prisma migrations** — initial migration + `db:migrate:deploy` for production

### 2.9 Phase C — CI & quality (v0.15)

- [x] **GitHub Actions CI** — build, TypeScript lint, Playwright E2E on PR/push
- [x] **Playwright checkout test** — digital product happy path against production server
- [x] **`mapDbProduct`** — Prisma → `@fosl/contracts` mapper
- [x] **Docker Compose** — optional local MySQL 8 (`docker compose up -d mysql`)
- [x] **Root `.env` loading** — `scripts/load-root-env.mjs` in Hub + Storefront next.config

### 2.10 Phase B — orders & fulfillment (v0.16)

- [x] **Orders API** — `GET /api/v1/orders`, `GET/PATCH /api/v1/orders/[id]` (storefront + hub)
- [x] **Storefront order history** — `/orders` and `/orders/[id]` wired to API + localStorage email
- [x] **Hub order management** — vendor/operator order lists and detail pages
- [x] **Vendor fulfillment UI** — mark shipped/delivered + tracking on order lines
- [x] **Multi-vendor Stripe** — `multi_vendor` settlement metadata + transfer job on webhook
- [x] **Image uploads** — `POST /api/v1/uploads` (hub) with local `uploads/` storage in dev
- [x] **Subscription banner** — storefront operator subscription state via env
- [x] **Hub legal pages** — `/legal/terms`, `/legal/privacy` + sidebar links
- [x] **E2E expansion** — physical checkout, referral attribution, hub role switcher

### 2.11 Phase B — API mocking controls (v0.17)

- [x] **`NEXT_PUBLIC_API_MOCKING`** — explicit dev-only flag; MSW never starts in production
- [x] **Marketplace orders** — `/marketplace/orders` wired to same orders API as storefront

### 2.12 Phase B — MySQL & Admin settings (v0.18)

- [x] **MySQL 8 default** — Docker Compose, Prisma provider, migration regenerated
- [x] **Local uploads** — repo-root `uploads/` via `UPLOAD_DIR` and Hub `getUploadDir()`
- [x] **Admin platform settings** — auto deploy, file storage, Postmark/Resend, Stripe status, feature flags
- [x] **`platform_config` table** — persisted settings API (`GET/PATCH /api/v1/settings`, deploy trigger)

---

## 3. Development changelog

Chronological summary of meaningful changes (commits and session work).

| Version | Commit | Summary |
|---------|--------|---------|
| v0.1 | `9394b3d` | Initial omni-channel UI prototype |
| v0.2 | `e249dc1` | FOSLOne branding, `/[store]` paths, Creator terminology |
| v0.6 | `1cf42d4` | Cart UX, MSW, yellow rebrand, admin polish, PDP/checkout field pass |
| v0.7 | `f6d1925` | FOSLOne images, hero background, legal pages, product card actions, team layout |
| v0.8 | `e9ccbd3` | Contact API, loading skeletons, products API route, Phase A wrap-up |
| v0.9 | `59e731f` | `@fosl/db` Prisma schema + seed |
| docs | `a3f5e7c` | PROJECT_PLAN.md roadmap and changelog |
| v0.10 | `f3b0a6a` | Auth.js Hub sign-in, Prisma products API, docker-compose, root env loading |
| v0.11 | `855513f` | Stripe webhooks, Connect destination charges on payment intent |
| v0.12 | `c4dd5d1` | Creator attribution cookies + commission ledger on checkout |
| v0.13 | `d61d43d` | Commission Connect payouts, order confirmation email |
| v0.14 | `0b751da` | Hub password reset email + Prisma migrations workflow |
| v0.15 | `521f12c` | GitHub Actions CI + Playwright checkout E2E |
| v0.16 | `df86c62` | Orders API, fulfillment, multi-vendor Stripe, uploads, E2E expansion |
| v0.17 | `00fc766` | MSW production guard, marketplace orders API, upload routes fix |
| v0.18 | (pending) | MySQL 8 default, Admin platform settings, local upload dir |

### v0.16 detail (latest)

| Area | Change |
|------|--------|
| **Orders** | List/detail APIs, storefront `/orders`, hub vendor/operator order pages |
| **Fulfillment** | PATCH order status + line tracking; vendor detail fulfillment form |
| **Stripe** | Multi-vendor cart metadata + `settleMultiVendorPayment` on webhook |
| **Uploads** | Hub `POST /api/v1/uploads` + catalog image field |
| **Polish** | Subscription banner, hub legal links, expanded Playwright suite |

### v0.10 detail

| Area | Change |
|------|--------|
| **Auth** | `auth.ts`, `auth.config.ts`, middleware, `SignInForm`, `HubProviders`, session in `hub-shell` |
| **API** | `GET /api/v1/products` reads Prisma when `DATABASE_URL` set; falls back to mocks |
| **DB** | Seed bcrypt users; `mapDbProduct`; `docker-compose.yml` for local Postgres |
| **Dev** | `scripts/load-root-env.mjs`; `db:up` / `db:setup` root scripts |

### v0.8 detail

| Area | Change |
|------|--------|
| **Contact** | `ContactForm`, `POST /api/v1/contact`, MSW handler |
| **API** | `GET /api/v1/products` — catalog fetch from products listing |
| **Skeletons** | `Skeleton` UI primitive; catalog, cart drawer, checkout loaders |
| **Cart** | `isHydrated` exposed on cart context |

### v0.7 detail

| Area | Change |
|------|--------|
| **Assets** | `public/foslone/*` (team photos, blog images, section SVGs, seal, favicon); `public/stock/hero-online-shopping.jpg` |
| **Home** | Full-bleed hero; audience cards with illustrations; team 3-column layout; blog thumbnails |
| **Components** | `ProductCardActions`, `LegalDocument`, `product-card-actions.tsx` shared by catalog + marketplace cards |
| **Legal** | `lib/legal.ts`, `lib/legal-content.ts`; routes `/legal`, `/legal/[slug]` |
| **Compliance UX** | Terms + Privacy checkbox at payment step; cookie policy link in banner |
| **Config** | `lib/foslone.ts` — images, team, blog, audience cards |

### v0.6 detail

| Area | Change |
|------|--------|
| **Cart** | `cart-context.tsx`, `cart-drawer.tsx`, `cart-line-item.tsx`, `quantity-stepper.tsx`, `add-to-cart-button.tsx` |
| **MSW** | `packages/mocks/src/msw-handlers.ts`, per-app `MswInit` |
| **Brand** | `packages/ui/tailwind.preset.ts`, tokens, bulk color script `scripts/rebrand-colors.cjs` |
| **PDP** | `product-detail.tsx` type-specific blocks |

---

## 4. Legal pages (v0.7)

| Policy | Route | Status |
|--------|-------|--------|
| Terms of Service | `/legal/terms` | [x] Template live |
| Privacy Policy | `/legal/privacy` | [x] GDPR + CCPA sections |
| Cookie Policy | `/legal/cookies` | [x] Aligned with cookie banner |
| Returns & Refunds | `/legal/returns` | [x] |
| Shipping Policy | `/legal/shipping` | [x] |
| Creator Program Terms | `/legal/creator-terms` | [x] |
| Seller & Vendor Terms | `/legal/vendor-terms` | [x] |
| Acceptable Use | `/legal/acceptable-use` | [x] |
| Accessibility Statement | `/legal/accessibility` | [x] |

**Before production:** attorney review, registered business address in `legal.ts`, confirm arbitration/jurisdiction.

---

## 5. Open / not done

### 5.1 Phase A — remaining UI polish

- [ ] Storybook component catalog
- [x] Operator subscription / plan banners on storefront
- [x] Hub & Admin: duplicate or link legal policies if required for logged-in flows
- [ ] Replace placeholder legal address and emails with production values

### 5.2 Phase B — backend

- [x] Prisma schema + seed (`packages/db`)
- [x] Prisma initial migration + `npm run db:migrate:deploy`
- [x] Auth.js (Hub sign-in, roles: vendor / creator / operator / admin)
- [x] Stripe: Connect multi-vendor settlement (transfer job on webhook)
- [x] Stripe: Payment Element, webhooks, single-vendor Connect destination charges, creator commission transfers
- [ ] Stripe: Tax, transfer reconciliation
- [x] REST API slice — products, orders (GET/PATCH), contact, payouts, uploads (partial vs MSW)
- [ ] Order fulfillment webhooks (inventory sync beyond checkout decrement)
- [x] Creator attribution cookies + commission ledger (checkout)
- [x] File storage for product images (local `uploads/` directory; S3 for production later)

### 5.3 Phase C — production

- [ ] ICDSoft deploy per [DEPLOYMENT-ICDSOFT.md](./DEPLOYMENT-ICDSOFT.md)
- [ ] Environment secrets (Stripe, DB, auth)
- [ ] Domain + SSL (foslone.com / operator custom domains)
- [ ] Error monitoring (Sentry or similar)

### 5.4 Explicitly out of scope (for now)

- Separate field-level wireframe PDF/spec document (implemented inline)
- Awake.VC / Shoptype references in customer-facing copy (removed by design)
- Live payment processing in prototype mode

---

## 6. Next steps (recommended order)

### Immediate (finish Phase A)

1. ~~Smoke-test v0.7~~ — build passes (`npm run build -w @fosl/storefront`)
2. ~~Contact form~~ — done (`/api/v1/contact`)
3. ~~Loading skeletons~~ — catalog, cart drawer, checkout
4. ~~Legacy route~~ — `/coseller-support` redirect exists

### Short term (Phase B) — **next up**

5. ~~**Prisma schema**~~ — done (`packages/db/prisma/schema.prisma`)
6. **Run database locally** — `cp .env.example .env`, then either `npm run db:setup` (Docker) or install Postgres and run `npm run db:push && npm run db:seed`
7. ~~**Auth.js**~~ — Hub sign-in + middleware when `AUTH_SECRET` set
8. ~~**Stripe test mode**~~ — Payment Element + `POST /api/v1/checkout/payment-intent` (mock without keys)
9. **Quality** — CI + E2E done; **next:** production deploy (ICDSoft), MSW off in production, S3 uploads in prod

### Before go-live

10. **Legal review** — counsel sign-off on `legal-content.ts`
11. **Production deploy** — ICDSoft WebApps, env vars, `db:migrate:deploy`
12. ~~**MSW off in production**~~ — `NEXT_PUBLIC_API_MOCKING` + production guard in `MswInit`

---

## 7. How to update this file

When shipping a milestone:

1. Bump **Current release** and **Last updated** at the top.
2. Add a row to §3 changelog and a subsection under §2 if the milestone is complete.
3. Move items from §5 to §2 with `[x]` when done.
4. Adjust §6 next steps to reflect new priorities.

---

*Maintainer note: This plan reflects repo state through v0.18 (pending push) on `master`.*
