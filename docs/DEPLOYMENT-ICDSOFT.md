# FOSL — ICDSoft Deployment Runbook

No Docker. Deploy to ICDSoft WebApps using the **sureapp** CLI (same pattern as **YooSupport** on this server — single `yoosupport` WebApp, `git pull` + low-memory build + `--stop` / `--start`).

## Compared to YooSupport (already on this server)

| | **YooSupport** | **FOSL** |
|---|----------------|----------|
| Apps | 1 Next.js app (`yoosupport`) | **3 WebApps:** `fosl-hub`, `Storefront`, `fosl-api` |
| Repo on server | Git clone + rsync to app dir | Single monorepo at `/home/foslone/private/FOSL` |
| Start command | `npm start` in app dir | `node scripts/icdsoft-start.mjs` per service |
| Restart | `--stop` then `--start` (no `--restart`) | Same |
| Build memory | `LOW_MEMORY_BUILD`, `NODE_OPTIONS=768` | Same |
| Bootstrap secrets | `.env`: `DATABASE_URL`, `AUTH_SECRET` | Same + Platform → `/admin/settings` after first boot |
| DB on ICDSoft | MySQL / Postgres via `db:push` | MySQL `127.0.0.1:3308`, `db:push` if migrate fails |

Use **absolute paths** inside `sureapp project shell` (tilde `~` can expand wrong — same as YooSupport).

## Deploy branch

Production on ICDSoft runs from **`refactor/two-app-platform`** — not `master`. The two-app refactor (platform + storefront) stays on this branch until you merge it later.

| Where | Branch |
|-------|--------|
| Server `git pull` / recovery | `refactor/two-app-platform` |
| Platform → Admin → Settings → Auto deploy | `refactor/two-app-platform` (read-only; enforced in code) |
| CI (`push`) | `master` and `refactor/two-app-platform` |

**On the server** (after clone or for updates):

```bash
cd /home/foslone/private/FOSL
git fetch origin refactor/two-app-platform --force
git checkout refactor/two-app-platform
git reset --hard origin/refactor/two-app-platform
```

Or run `bash scripts/git-deploy-pull.sh` from the repo root (same commands).

## Prerequisites
- ICDSoft WebApps plan with Node.js LTS (22+)
- MySQL 8 (default; ICDSoft MySQL script) or PostgreSQL
- SSH access + sureapp CLI
- **Subdomains only** — the apex domain [foslone.com](https://foslone.com) stays the existing marketing site; FOSL apps run on subdomains below
- Stripe webhook URL: `https://shop.foslone.com/api/webhooks/stripe` (or `https://api.foslone.com/api/webhooks/stripe` when using dedicated API host)

## Domain mapping

| Domain | App | Purpose |
|--------|-----|---------|
| `https://hub.foslone.com` | Platform | Vendor, Creator, Operator workspaces + `/admin` settings |
| `https://shop.foslone.com` | Storefront | Customer shop UI, marketplace, checkout |
| `https://api.foslone.com` | Commerce API | Headless catalog/checkout API (`@fosl/api`) |
| `https://admin.foslone.com` | *(redirect)* | Redirects to `https://hub.foslone.com/admin` (middleware) |

The apex **`https://foslone.com`** is not used for FOSL apps at this stage — keep it on the current FOSLOne marketing site. Link to the shop from there (e.g. Marketplace → `shop.foslone.com`).

In **Platform → Admin → Settings → App URLs**, use exactly:

| Setting | URL |
|---------|-----|
| Platform (Hub) | `https://hub.foslone.com` |
| Storefront | `https://shop.foslone.com` |
| Commerce API | `https://api.foslone.com` |
| Admin | `https://hub.foslone.com/admin` |
| Auth URL | `https://hub.foslone.com` |

## Server directories

| Path | Purpose |
|------|---------|
| `/home/foslone/private/FOSL` | Full monorepo git clone (platform + storefront) |
| `/home/foslone/private/FOSL/uploads` | Local product images (if not using S3) |

Deploy the **entire monorepo** — not a single `apps/platform` folder. Workspaces need `packages/`, root `package.json`, etc.

## WebApps (three services)

Create **three** ICDSoft Node.js WebApps, each with working directory `/home/foslone/private/FOSL`:

| WebApp | `FOSL_APP` | Example port |
|--------|------------|--------------|
| fosl-hub | `platform` | 26104 |
| Storefront | `storefront` | 1629 |
| fosl-api | `api` | 21942 |

| Service | Start command (ICDSoft panel) |
|---------|--------------------------------|
| **All three** | `node scripts/icdsoft-start.mjs` |

Both use release directory `/home/foslone/private/FOSL`. **Do not use plain `npm start`** — the repo root has no `start` script.

### Shared release directory (important)

ICDSoft stores **one `start_cmd` per release directory**. All three WebApps share `/home/foslone/private/FOSL`, so `sureapp project modify --start-cmd` in any shell updates **all** projects.

Use the router script `scripts/icdsoft-start.mjs`. It picks the app from:

1. `FOSL_APP` (`platform` / `storefront` / `api`) via `sureapp env set` in each WebApp shell, or
2. `PORT` from `sureapp project list` (defaults baked into the script for foslone@s1282).

**One-time setup** (run once per WebApp shell):

```bash
cd /home/foslone/private/FOSL
sureapp project shell fosl-hub
sureapp project modify --start-cmd "node scripts/icdsoft-start.mjs"
sureapp env set FOSL_APP platform
exit

sureapp project shell Storefront
sureapp env set FOSL_APP storefront
exit

sureapp project shell fosl-api
sureapp env set FOSL_APP api
sureapp env set STOREFRONT_INTERNAL_ORIGIN 'http://127.0.0.1:1629'
exit
```

Set on **Storefront** (and platform if desired) for custom-domain rewrites + API proxy:

```bash
sureapp env set FOSL_INTERNAL_SECRET 'random-secret-min-32-chars'
sureapp env set STOREFRONT_INTERNAL_ORIGIN 'http://127.0.0.1:1629'
```

On **fosl-api**, set `STOREFRONT_INTERNAL_ORIGIN` to the internal Storefront URL so checkout/product routes proxy correctly.

If ports change after recreating WebApps, update `PORT_TO_APP` in `scripts/icdsoft-start.mjs` to match `sureapp project list`.

**Optional — legacy `admin` WebApp:** disable or remove the third WebApp (`admin` on port 31035). Point `admin.foslone.com` at the **same** platform service as `hub.foslone.com`; middleware redirects to `/admin`.

**Auth / DB env** (set in platform WebApp shell):

```bash
sureapp env set AUTH_SECRET 'your-secret-min-32-chars'
sureapp env set AUTH_URL 'https://hub.foslone.com'
sureapp env set DATABASE_URL 'mysql://...'
```

Rebuild platform after setting `AUTH_SECRET`: `npm run build -w @fosl/platform`

Map domains in ICDSoft:

| ICDSoft service (`sureapp project list`) | Domain |
|------------------------------------------|--------|
| `Storefront` | `shop.foslone.com` |
| `fosl-api` | `api.foslone.com` |
| `fosl-hub` | `hub.foslone.com` (+ optional `admin.foslone.com` → same app) |

### Operator Connect + headless storefronts (after pull)

1. Apply migration `20250624120000_operator_connect_storefront_keys` (or `npm run db:push` on fresh DB).
2. `npm run db:seed` — seeds `pk_sf_…` keys on demo storefronts and demo operator Connect id.
3. **Hub → Operator → Payments & Stripe Connect** — complete Express onboarding (production).
4. **Hub → Operator → Storefronts** — copy publishable key for self-hosted shops.
5. **Hub → Operator → Domains** — custom domain + CORS origins.
6. Rebuild all three apps: `npm run build -w @fosl/platform && npm run build -w @fosl/storefront && npm run build -w @fosl/api`

See also `docs/NETWORK-CATALOG-SPEC.md`, `docs/API-REFERENCE.md`, `templates/operator-starter/`.

## First-time deploy

Use **either** sureapp shell (`fosl-hub` or `Storefront`) — they share the same working directory.

```bash
sureapp project shell fosl-hub   # or: sureapp project shell Storefront

cd /home/foslone/private
git clone https://github.com/santoshvh/FOSL-Omni-Channel.git FOSL
cd /home/foslone/private/FOSL
git fetch origin refactor/two-app-platform --force
git checkout refactor/two-app-platform
git reset --hard origin/refactor/two-app-platform
```

Bootstrap database (before Admin UI is configured). Create `/home/foslone/private/FOSL/.env` (ICDSoft env panel or file on disk):

```env
DATABASE_PROVIDER=mysql
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@127.0.0.1:3308/foslone_fosldevv1"
AUTH_SECRET="paste-at-least-32-random-characters-here"
```

Generate a secret (run locally or on server): `openssl rand -base64 32`

Use the host and port from the ICDSoft MySQL panel (often `127.0.0.1:3308`, not `localhost:3306`). Then `chmod 600 .env`.

Verify after any deploy (same check as YooSupport):

```bash
test -f /home/foslone/private/FOSL/.env && echo OK || echo MISSING
grep -E '^AUTH_SECRET=|^DATABASE_URL=' /home/foslone/private/FOSL/.env
```
Then:

```bash
cd /home/foslone/private/FOSL
npm ci
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
```

If migrate fails, see **Database troubleshooting** below — `db:push` is fine for a fresh empty database.

```bash
export LOW_MEMORY_BUILD=true
export NODE_OPTIONS=--max-old-space-size=768
export NEXT_TELEMETRY_DISABLED=1
npm run build
```

If memory is tight, build one app at a time:

```bash
npm run build -w @fosl/platform
npm run build -w @fosl/storefront
```

Start services (from **hub** shell):

```bash
sureapp project shell fosl-hub
cd /home/foslone/private/FOSL

sureapp service manage --start fosl-hub
sureapp service manage --start Storefront
```

## Resume deployment (foslone@s1282)

If `npm ci`, `db:push`, and `npm run build` already succeeded, finish with:

```bash
sureapp project shell fosl-hub
cd /home/foslone/private/FOSL

# 1. Confirm bootstrap files
test -f .env && echo ".env OK" || echo "CREATE .env FIRST"
test -d apps/platform/.next && test -d apps/storefront/.next && echo "builds OK"

# 2. Start both services (from hub shell)
sureapp service manage --start Storefront
sureapp service manage --start fosl-hub

# 3. Smoke test
curl -sI https://hub.foslone.com/admin | head -3
curl -sI https://shop.foslone.com/marketplace | head -3
curl -sI https://hub.foslone.com/auth/sign-in | head -3
curl -s https://shop.foslone.com/api/v1/products | head -c 300
```

Then open **https://hub.foslone.com/admin/settings** → set subdomain URLs, MySQL, deploy branch (read-only), disable API mocking → Save.

Restart storefront from hub shell (restart hub from ICDSoft panel if needed):

```bash
sureapp service manage --stop Storefront && sureapp service manage --start Storefront
```

Demo login after seed: `alex@acmecatalog.com` / `demo123`

## Deployment recovery (current)

Use this when services return **503**, **ChunkLoadError**, **MissingSecret**, **EADDRINUSE**, or after pulling env-loading fixes (`load-root-env.mjs`, `icdsoft-start.mjs`). Run from **foslone@s1282** unless noted.

**Ports** (from `sureapp project list` — update `scripts/icdsoft-start.mjs` if these change):

| Service | Project name | Port |
|---------|--------------|------|
| Platform | `fosl-hub` | **26104** |
| Storefront | `Storefront` | **1629** |
| Commerce API | `fosl-api` | **21942** |

### 1. SSH and enter hub shell

```bash
ssh foslone@s1282.icdsoft.com
sureapp project shell fosl-hub
cd /home/foslone/private/FOSL
```

**Verify:** prompt shows you are inside the sureapp shell; `pwd` prints `/home/foslone/private/FOSL`.

### 2. Pull latest code

```bash
bash scripts/git-deploy-pull.sh
```

**Verify:** `git log -1 --oneline` shows recent commits on `refactor/two-app-platform`.

### 3. Verify bootstrap `.env`

```bash
test -f .env && echo ".env OK" || echo "CREATE .env FIRST"
grep -E '^AUTH_SECRET=|^DATABASE_URL=' .env
```

**Verify:** both lines present; `AUTH_SECRET` is at least 32 characters. If missing, create `.env` (see **First-time deploy**) and `chmod 600 .env`.

### 4. Install deps (do not omit dev — `@next/env` is required at runtime)

```bash
npm ci
```

Do **not** use `npm ci --omit=dev` — production start scripts import `@next/env` via `scripts/load-root-env.mjs`.

**Verify:** `test -d node_modules/@next/env && echo OK`.

### 5. Confirm shared start command and per-app routing

One `start_cmd` for both WebApps (shared release dir):

```bash
sureapp meta config --json | grep -i start
```

Expected: `"start-cmd": "node scripts/icdsoft-start.mjs"` (or equivalent). If wrong:

```bash
sureapp project modify --start-cmd "node scripts/icdsoft-start.mjs"
```

Per-app env (set once in each project shell if not already):

```bash
# fosl-hub shell
sureapp env set FOSL_APP platform
# Storefront shell
sureapp env set FOSL_APP storefront
```

**Verify:** start logs show `[icdsoft-start] PORT=26104 → @fosl/platform` (port varies per service).

### 6. Kill stale processes (fixes EADDRINUSE / crash-loop ChunkLoadError)

```bash
fuser -k 26104/tcp 2>/dev/null || true
fuser -k 1629/tcp 2>/dev/null || true
fuser -k 21942/tcp 2>/dev/null || true
sleep 2
```

**Verify:** `ss -tlnp 2>/dev/null | grep -E '26104|1629'` shows nothing listening (or only after `--start` in step 7).

### 7. Stop then start both services

Manage **Storefront** from the **platform** shell. There is no `sureapp service manage --restart` — always `--stop` then `--start`.

```bash
sureapp service manage --stop Storefront 2>/dev/null || true
sureapp service manage --start Storefront
```

Restart **platform** from the ICDSoft control panel (WebApps → fosl-hub → Restart), or from the **Storefront** shell:

```bash
sureapp service manage --stop fosl-hub && sureapp service manage --start fosl-hub
```

If already stopped, `--start` only is fine:

```bash
sureapp service manage --start fosl-hub
```

**Verify:** each `--start` reports success (no `ERROR: Internal error` — if so, see **sureapp service troubleshooting**).

### 8. Local port smoke test

```bash
curl -sI http://127.0.0.1:26104/auth/sign-in | head -3    # platform
curl -sI http://127.0.0.1:1629/marketplace | head -3     # storefront
curl -sI http://127.0.0.1:26104/admin/settings | head -3 # admin (same app)
```

| Result | Action |
|--------|--------|
| `HTTP/1.1 200` or `307` | App is up — check public DNS if HTTPS still fails |
| Connection refused | Read logs (step 9), fix env/build, repeat from step 6 |

### 9. Read startup logs

```bash
sureapp log follow
```

Look for:

- `[icdsoft-start] ... AUTH_SECRET=set` (not `MISSING`)
- `[next-start] app=platform port=26104 AUTH_SECRET=set`
- No `EADDRINUSE`, no `Cannot find package '@next/env'`

Ctrl+C to exit log follow.

### 10. Fix AUTH_SECRET at runtime (MissingSecret)

`.env` is loaded by `load-root-env.mjs` at start. Also set in sureapp so env is visible even if file permissions differ:

```bash
sureapp env set AUTH_SECRET 'same-value-as-in-dotenv'
sureapp env set AUTH_URL 'https://hub.foslone.com'
```

Restart hub (panel or non-hub shell per step 7).

**Verify:** `curl -sI https://hub.foslone.com/auth/sign-in | head -3` returns 200/307, not 500.

### 11. One-time hub rebuild (after `next.config` AUTH_SECRET fix)

If hub still shows **MissingSecret** after step 10, old build may have inlined an empty secret:

```bash
cd /home/foslone/private/FOSL
export LOW_MEMORY_BUILD=true NODE_OPTIONS=--max-old-space-size=768 NEXT_TELEMETRY_DISABLED=1
npm run build -w @fosl/platform
```

Restart hub (step 7), then re-check step 8–10.

### 12. Admin settings (production URLs + DB)

1. Open `https://hub.foslone.com/admin/settings`
2. Hub `https://hub.foslone.com`, Storefront `https://shop.foslone.com`, Admin `https://hub.foslone.com/admin`, Auth URL `https://hub.foslone.com`
3. MySQL connection, **disable API mocking**, Save (deploy branch is fixed to `refactor/two-app-platform`)

Restart both services (step 7).

### 13. Public smoke tests

```bash
curl -sI https://hub.foslone.com/admin/settings | head -3
curl -sI https://shop.foslone.com/marketplace | head -3
curl -sI https://hub.foslone.com/auth/sign-in | head -3
curl -s https://shop.foslone.com/api/v1/products | head -c 300
```

**Verify:** products JSON includes `"source": "database"` when DB is configured. Demo login: `alex@acmecatalog.com` / `demo123`.

## Configure production (Admin)

1. Open `https://hub.foslone.com/admin/settings`
2. Set app URLs: Hub `https://hub.foslone.com`, Storefront `https://shop.foslone.com`, Admin `https://hub.foslone.com/admin`, Auth URL `https://hub.foslone.com`
3. Set MySQL, Stripe, email, file storage
4. **Disable API mocking** for production
5. Save — writes `.fosl-runtime.json` at `/home/foslone/private/FOSL/.fosl-runtime.json`

Restart both services after saving:

```bash
sureapp service manage --stop fosl-hub && sureapp service manage --start fosl-hub
sureapp service manage --stop Storefront && sureapp service manage --start Storefront
```

**Critical:** Never rsync or commit `.env` or `.fosl-runtime.json` — they live only on the server.

## Routine deploy (updates)

Use any sureapp shell; same shared repo path.

```bash
sureapp project shell fosl-hub   # or: sureapp project shell Storefront
cd /home/foslone/private/FOSL

bash scripts/git-deploy-pull.sh

npm ci
npm run db:migrate:deploy

export LOW_MEMORY_BUILD=true
export NODE_OPTIONS=--max-old-space-size=768
export NEXT_TELEMETRY_DISABLED=1
npm run build -w @fosl/platform
npm run build -w @fosl/storefront

sureapp service manage --stop fosl-hub && sureapp service manage --start fosl-hub
sureapp service manage --stop Storefront && sureapp service manage --start Storefront
```

## Verify

| Check | URL | Expected |
|-------|-----|----------|
| Admin settings | `https://hub.foslone.com/admin/settings` | Saves to database |
| Hub sign-in | `https://hub.foslone.com/auth/sign-in` | Login works |
| Storefront | `https://shop.foslone.com/marketplace` | Products load |
| Products API | `https://shop.foslone.com/api/v1/products` | `"source": "database"` when DB is up |

## External webhooks

| Integration | URL |
|-------------|-----|
| Stripe | `https://shop.foslone.com/api/webhooks/stripe` |
| Shopify orders | `https://hub.foslone.com/api/webhooks/shopify/orders` |
| WooCommerce orders | `https://hub.foslone.com/api/webhooks/woocommerce/orders` |

## Background jobs

Use ICDSoft cron (from repo root):

```bash
# Catalog sync every 15 min
*/15 * * * * cd /home/foslone/private/FOSL && npm run jobs:sync-catalog

# External order status sync
*/30 * * * * cd /home/foslone/private/FOSL && npm run jobs:sync-order-status

# Commission payouts (example: daily at 2am)
0 2 * * * cd /home/foslone/private/FOSL && npm run jobs:payout-commissions
```

## References

- [ICDSoft Running Next.js](https://www.icdsoft.com/en/kb/view/1141_running_next_js)

## Database troubleshooting

### `DATABASE_URL` not found

Create `/home/foslone/private/FOSL/.env` with your ICDSoft MySQL connection string (see above).

### P3018 / MySQL error 1064 near `CREATE TABLE` (line 1)

Often a **UTF-8 BOM** at the start of `migration.sql` (invisible `ï»¿` before `CREATE`). Fixed in repo — `git pull` then retry. If migrate already failed once:

```bash
cd /home/foslone/private/FOSL/packages/db
npx dotenv -e ../../.env -- npx prisma migrate resolve --rolled-back 20250623120000_init
cd /home/foslone/private/FOSL
npm run db:migrate:deploy
```

### P3018 / MySQL error 1064 near `-- CreateTable`

ICDSoft MySQL can reject Prisma’s `-- CreateTable` comment lines. On a **fresh empty database**, use push instead:

```bash
cd /home/foslone/private/FOSL/packages/db
npx dotenv -e ../../.env -- npx prisma migrate resolve --rolled-back 20250623120000_init

cd /home/foslone/private/FOSL
npm run db:push
npm run db:seed
```

(`dotenv` is not on PATH on ICDSoft — use `npx dotenv`.)
`db:push` applies the full current schema (including tables added after the initial migration). After `git pull` on `refactor/two-app-platform`, `db:migrate:deploy` also works (comment lines removed from the migration SQL).

## sureapp service troubleshooting

### Sites return 503 after `--start` says successful

`sureapp` has no `--status` flag on this host. Diagnose in three steps:

**A — Is anything listening on the assigned ports?** (from `sureapp project list`)

```bash
curl -sI http://127.0.0.1:26104/ | head -3    # platform (fosl-hub)
curl -sI http://127.0.0.1:1629/ | head -3     # Storefront
```

| Result | Meaning |
|--------|---------|
| `HTTP/1.1 200` or `307` | App is up — fix **domain mapping** in ICDSoft panel (subdomain → correct WebApp) |
| Connection refused | App crashed or wrong port — do step B |

**B — Run one app manually and read errors:**

```bash
sureapp project shell fosl-hub
cd /home/foslone/private/FOSL
echo "PORT=$PORT"
npm run start -w @fosl/platform
```

You must see `Local: http://0.0.0.0:26104` (port matches `sureapp project list`). Ctrl+C when done, then `sureapp service manage --start fosl-hub`.

Start script on server must be:

```json
"start": "next start -H 0.0.0.0 -p ${PORT:-3000}",
```

**Do not use `sed` on `package.json`** — patterns like `s|"start": .*|...|` can remove the trailing comma and break JSON (`EJSONPARSE`). Restore with `git checkout -- apps/*/package.json` then run:

```bash
# Inside sureapp project shell (node required)
cd /home/foslone/private/FOSL
node scripts/fix-icdsoft-start.mjs
```

Or paste the inline fix from **Resume deployment** below if the script is not on the server yet.

**C — Logs and start command** (same as YooSupport):

```bash
sureapp project shell fosl-hub
sureapp meta config --json
sureapp log follow
```

Confirm **start-cmd** in the panel (or meta config) is exactly:

| Project | Start command |
|---------|---------------|
| Both WebApps (shared release dir) | `node scripts/icdsoft-start.mjs` |

Plus per-app `FOSL_APP` via `sureapp env set` (see **Shared release directory**). Do **not** set different `npm run start -w @fosl/...` per WebApp — the last edit wins for everyone.

If start-cmd is wrong:

```bash
sureapp project modify --start-cmd "node scripts/icdsoft-start.mjs"
```

### `ERROR: Internal error` on `--enable` or `--start` (storefront)

`sureapp service manage --start fosl-hub` works but **storefront** returns internal error → the WebApp is probably **not created yet** or uses a **different project name**.

**Step 1 — list what actually exists:**

```bash
# Run from normal SSH (not required to be in a subshell)
sureapp project list
```

You should see **two** FOSL Node.js projects (`fosl-hub` and `Storefront`). If you only see `fosl-hub` (and maybe `yoosupport`), create the missing app in the **ICDSoft control panel** (WebApps → Add application):

| Name | Engine | Release directory | Start command |
|------|--------|-------------------|---------------|
| `Storefront` | Node.js LTS | `/home/foslone/private/FOSL` | `node scripts/icdsoft-start.mjs` |

Then map domain: `shop.foslone.com` → `Storefront`. Map `admin.foslone.com` to the **same** platform WebApp as `hub.foslone.com` (redirect handled in middleware).

**Step 2 — enable via panel** (red circle → green) if CLI `--enable` fails.

**Step 3 — start using exact names from `sureapp project list`:**

```bash
sureapp service manage --start <exact-name-from-list>
```

### `ERROR: Internal error` when stopping a service

**Fix:** manage the other service from a *different* shell, or use the ICDSoft control panel.

```bash
sureapp project shell fosl-hub
sureapp service manage --stop Storefront && sureapp service manage --start Storefront
```

To restart **hub** while you are in the hub shell, use the control panel instead, or run only `--start` if it is already stopped.

### Service name mismatch

WebApp names must match exactly (case-sensitive). Run `sureapp project list` — on this server: `Storefront`, `fosl-hub`.

### Port already in use (`EADDRINUSE`)

Stale Node processes after a crash loop can hold ports **26104** and **1629**:

```bash
fuser -k 26104/tcp 2>/dev/null || true
fuser -k 1629/tcp 2>/dev/null || true
fuser -k 21942/tcp 2>/dev/null || true
sleep 2
sureapp service manage --start Storefront
# restart fosl-hub via panel or from Storefront shell
```

### `--start` only (service already stopped)

If a service is down, skip `--stop`:

```bash
sureapp service manage --start Storefront
sureapp service manage --start fosl-hub
```

### App crashes on start (check logs)

From any shell in `/home/foslone/private/FOSL`:

```bash
test -f .env && echo ".env OK" || echo ".env MISSING"
test -d node_modules/@next/env && echo "@next/env OK" || echo "run npm ci (not --omit=dev)"
test -d apps/platform/.next && echo "platform build OK" || echo "platform NOT built"

# Manual smoke test — use assigned PORT from sureapp project list (Ctrl+C to exit)
PORT=26104 npm run start -w @fosl/platform
```

If port is in use: `fuser -k 1629/tcp` (replace port per app). If manual start prints errors (missing `DATABASE_URL`, `Cannot find package '@next/env'`, etc.), fix those before using sureapp again. Check ICDSoft **WebApps → Logs** for each service.

### Sites still broken after services start

| URL | Check |
|-----|-------|
| `https://admin.foslone.com/settings` | Configure URLs + MySQL; disable API mocking; save |
| `https://hub.foslone.com/auth/sign-in` | Needs `AUTH_SECRET` / `NEXTAUTH_SECRET` in `.env` or Admin settings |
| `https://shop.foslone.com/api/v1/products` | Should return `"source": "database"` when DB is configured |

### Hub sign-in: “Server error” / `MissingSecret`

Auth.js needs `AUTH_SECRET` at **runtime** (`.env`, `sureapp env set`, or Admin → Settings → Auth secret).

**Option A — quickest (no Admin UI):**

```bash
sureapp project shell fosl-hub
sureapp env set AUTH_SECRET 'same-value-as-in-dotenv'
sureapp env set AUTH_URL 'https://hub.foslone.com'
exit
sureapp service manage --stop fosl-hub && sureapp service manage --start fosl-hub
```

**Option B — Admin settings (recommended long-term):**

1. Open https://admin.foslone.com/settings
2. Under **Auth**, paste the same `AUTH_SECRET` and set Auth URL to `https://hub.foslone.com`
3. Save → writes `.fosl-runtime.json` at repo root
4. Restart hub: `sureapp service manage --stop fosl-hub && sureapp service manage --start fosl-hub`

After pulling the latest hub `next.config` fix, rebuild is only needed once:

```bash
sureapp project shell fosl-hub
export LOW_MEMORY_BUILD=true NODE_OPTIONS=--max-old-space-size=768
npm run build -w @fosl/platform
exit
```
