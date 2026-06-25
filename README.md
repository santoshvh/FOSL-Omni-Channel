# FOSL — Multi-Operator Social Commerce Platform

High-fidelity Next.js wireframe prototype for storefront and platform (vendor/creator/operator workspaces + admin).

## Quick start

```bash
npm install
npm run dev:platform    # http://localhost:3000  (workspaces + /admin)
npm run dev:storefront  # http://localhost:3001
```

## Apps

| App | Port | Description |
|-----|------|-------------|
| `@fosl/platform` | 3000 | Vendor, Creator, Operator workspaces + `/admin` console |
| `@fosl/storefront` | 3001 | Customer ecommerce (physical, digital, lead-gen) |

## Docs

- [PROJECT_PLAN.md](docs/PROJECT_PLAN.md) — roadmap, completed work, changelog, next steps
- [packages/db/README.md](packages/db/README.md) — Prisma schema & database commands
- [WIREFRAME_INVENTORY.md](docs/WIREFRAME_INVENTORY.md) — screen specs
- [LOCAL_DEV_URLS.md](docs/LOCAL_DEV_URLS.md) — local URLs
- [DEPLOYMENT-ICDSOFT.md](docs/DEPLOYMENT-ICDSOFT.md) — ICDSoft deploy runbook

## Stack

Next.js 15, React 19, Tailwind, shadcn/ui, MSW mocks, Prisma (MySQL 8 or PostgreSQL), Stripe.
