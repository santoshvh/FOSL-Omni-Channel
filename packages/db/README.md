# Database (Phase B)

Copy to repo root as `.env`:

```env
# postgresql | mysql — run `npm run db:sync-provider` after changing
DATABASE_PROVIDER=postgresql
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fosl_dev?schema=public"
```

## Commands (from repo root)

```bash
npm install
npm run db:sync-provider   # optional: switch postgresql ↔ mysql
npm run db:generate        # prisma generate
npm run db:push            # push schema to database (dev)
npm run db:seed            # seed from @fosl/mocks fixtures
npm run db:studio          # Prisma Studio GUI
```

## Package

`@fosl/db` exports a singleton `prisma` client and re-exports Prisma types.

Schema: `prisma/schema.prisma` — User, Operator, Storefront, Vendor, Product, Order, OrderLine, CreatorProfile, CreatorLink, Commission, plus Auth.js tables.
