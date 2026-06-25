# Database (Phase B)

Platform configuration (including database connection) is managed in **Platform → Admin → Settings** at http://localhost:3000/admin/settings. Saving settings writes `.fosl-runtime.json` at the repo root with `DATABASE_URL` and other runtime values.

For first-time bootstrap before Admin is configured, copy `.env.example` to `.env` at the repo root:

```env
# Optional bootstrap only — prefer Admin Settings
DATABASE_URL="mysql://fosl:password@localhost:3306/fosl_dev"
```

## Commands (from repo root)

```bash
npm install
npm run db:sync-provider   # sync schema provider from DATABASE_PROVIDER
npm run db:generate        # prisma generate
npm run db:push            # push schema to database (dev)
npm run db:seed            # seed from @fosl/mocks fixtures
npm run db:setup           # db:push && db:seed
npm run db:studio          # Prisma Studio GUI
```

## Package

`@fosl/db` exports a singleton `prisma` client, platform settings helpers, and re-exports Prisma types.

Schema: `prisma/schema.prisma` — User, Operator, Storefront, Vendor, Product, Order, OrderLine, CreatorProfile, CreatorLink, Commission, plus Auth.js tables.

## Image uploads

Hub product images use **Admin → Settings → File storage**:

- **Local** — files saved under the configured directory (default repo-root `uploads/`). Served at `GET /api/v1/uploads/[filename]` on the Hub app.
- **S3** — files uploaded to the configured bucket (`uploads/{uuid}.{ext}`). Public URL uses the configured prefix or default S3 virtual-hosted URL.

Configure bucket, region, public URL prefix, and credentials in Admin Settings. Saving writes AWS keys to `.fosl-runtime.json` when provider is S3.
