# Database (Phase B)

Copy to repo root as `.env`:

```env
DATABASE_PROVIDER=mysql
DATABASE_URL="mysql://fosl:fosl@localhost:3306/fosl_dev"
UPLOAD_DIR=../../uploads
```

## Commands (from repo root)

```bash
npm install
npm run db:up              # Docker MySQL 8 on port 3306
npm run db:sync-provider   # sync schema provider from DATABASE_PROVIDER
npm run db:generate        # prisma generate
npm run db:push            # push schema to database (dev)
npm run db:seed            # seed from @fosl/mocks fixtures
npm run db:studio          # Prisma Studio GUI
```

## Package

`@fosl/db` exports a singleton `prisma` client and re-exports Prisma types.

Schema: `prisma/schema.prisma` — User, Operator, Storefront, Vendor, Product, Order, OrderLine, CreatorProfile, CreatorLink, Commission, plus Auth.js tables.

## Image uploads

Hub stores product images under repo-root `uploads/` (gitignored). Served at `GET /api/v1/uploads/[filename]` on the Hub app.
