# FOSL — Multi-Operator Social Commerce Platform

High-fidelity Next.js wireframe prototype for storefront, hub (vendor/creator/operator), and platform admin.

## Quick start

```bash
npm install
npm run dev:hub        # http://localhost:3000
npm run dev:storefront # http://localhost:3001
npm run dev:admin      # http://localhost:3002
```

## Apps

| App | Port | Description |
|-----|------|-------------|
| `@fosl/hub` | 3000 | Vendor, Creator, Operator workspaces with role switcher |
| `@fosl/storefront` | 3001 | Customer ecommerce (physical, digital, lead-gen) |
| `@fosl/admin` | 3002 | Platform administration |

## Docs

- [PROJECT_PLAN.md](docs/PROJECT_PLAN.md) — roadmap, completed work, changelog, next steps
- [packages/db/README.md](packages/db/README.md) — Prisma schema & database commands
- [WIREFRAME_INVENTORY.md](docs/WIREFRAME_INVENTORY.md) — screen specs
- [LOCAL_DEV_URLS.md](docs/LOCAL_DEV_URLS.md) — local URLs
- [DEPLOYMENT-ICDSOFT.md](docs/DEPLOYMENT-ICDSOFT.md) — ICDSoft deploy runbook

## Stack

Next.js 15, React 19, Tailwind, shadcn/ui, MSW mocks, Prisma (MySQL 8 or PostgreSQL), Stripe.
