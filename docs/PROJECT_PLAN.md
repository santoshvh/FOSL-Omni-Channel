# FOSL Omni-Channel — Project Plan

Living document for scope, progress, changelog, and next steps.  
**Current release:** `v0.7` · **Last updated:** June 23, 2026 · **Repo:** [FOSL-Omni-Channel](https://github.com/santoshvh/FOSL-Omni-Channel)

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
| **A — UI prototype** | High-fidelity wireframes, mocks, FOSLOne branding, cart/checkout UX | **Mostly complete** (v0.7) |
| **B — Backend** | Prisma schema, Auth.js, Stripe live, real APIs replacing MSW | **Not started** |
| **C — Production** | ICDSoft deploy, legal review, monitoring, vendor onboarding | **Not started** |

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

---

## 3. Development changelog

Chronological summary of meaningful changes (commits and session work).

| Version | Commit | Summary |
|---------|--------|---------|
| v0.1 | `9394b3d` | Initial omni-channel UI prototype |
| v0.2 | `e249dc1` | FOSLOne branding, `/[store]` paths, Creator terminology |
| v0.6 | `1cf42d4` | Cart UX, MSW, yellow rebrand, admin polish, PDP/checkout field pass |
| v0.7 | `f6d1925` | FOSLOne images, hero background, legal pages, product card actions, team layout |

### v0.7 detail (latest)

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
- [ ] Skeleton loading states on catalog, cart, checkout
- [ ] Operator subscription / plan banners on storefront
- [ ] Contact form wired to email or API (currently prototype-only)
- [ ] Hub & Admin: duplicate or link legal policies if required for logged-in flows
- [ ] `coseller-support` route — redirect or alias to `creator-support` (legacy URL)
- [ ] Replace placeholder legal address and emails with production values

### 5.2 Phase B — backend (deferred)

- [ ] Prisma schema + migrations (MySQL 8 or PostgreSQL)
- [ ] Auth.js (Hub sign-in, roles: vendor / creator / operator / admin)
- [ ] Stripe: Payment Element, Connect split payouts, Tax, webhooks
- [ ] REST or tRPC API replacing MSW (`/api/v1/*`)
- [ ] Order persistence, inventory, webhooks for fulfillment
- [ ] Creator attribution cookies + commission ledger
- [ ] File storage for product images (S3 or equivalent)
- [ ] Email transactional (order confirm, password reset)

### 5.3 Phase C — production

- [ ] ICDSoft deploy per [DEPLOYMENT-ICDSOFT.md](./DEPLOYMENT-ICDSOFT.md)
- [ ] Environment secrets (Stripe, DB, auth)
- [ ] Domain + SSL (foslone.com / operator custom domains)
- [ ] Error monitoring (Sentry or similar)
- [ ] CI: lint, build, test on PR
- [ ] E2E tests (Playwright) for checkout happy path

### 5.4 Explicitly out of scope (for now)

- Separate field-level wireframe PDF/spec document (implemented inline)
- Awake.VC / Shoptype references in customer-facing copy (removed by design)
- Live payment processing in prototype mode

---

## 6. Next steps (recommended order)

### Immediate (finish Phase A)

1. **Smoke-test v0.7** — home hero, legal pages, cart Buy now, checkout terms checkbox on http://localhost:3001
2. **Contact form** — POST to API route or external form service; add success state
3. **Loading skeletons** — products grid, cart drawer, checkout steps
4. **Legacy route** — `/coseller-support` → redirect to `/creator-support`

### Short term (start Phase B)

5. **Prisma schema** — `User`, `Operator`, `Vendor`, `Product`, `Order`, `OrderLine`, `CreatorLink`, `Commission`
6. **Auth.js** — protect Hub routes; session on storefront for order history
7. **Stripe test mode** — replace mock payment block in checkout with real Payment Element
8. **API layer** — one vertical slice: `GET /api/v1/products`, `POST /api/v1/cart/checkout` with DB

### Before go-live

9. **Legal review** — counsel sign-off on `legal-content.ts`
10. **Production deploy** — ICDSoft WebApps, env vars, database
11. **MSW off in production** — `NEXT_PUBLIC_API_MOCKING` or build-time flag

---

## 7. How to update this file

When shipping a milestone:

1. Bump **Current release** and **Last updated** at the top.
2. Add a row to §3 changelog and a subsection under §2 if the milestone is complete.
3. Move items from §5 to §2 with `[x]` when done.
4. Adjust §6 next steps to reflect new priorities.

---

*Maintainer note: This plan reflects repo state through commit `f6d1925` on `master`.*
