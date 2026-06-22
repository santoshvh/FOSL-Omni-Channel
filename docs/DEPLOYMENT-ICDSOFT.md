# FOSL — ICDSoft Deployment Runbook

No Docker. Deploy to ICDSoft WebApps using the **sureapp** CLI (same pattern as YooSupport).

## Prerequisites

- ICDSoft WebApps plan with Node.js LTS (22+)
- PostgreSQL (ICDSoft PG script) or MySQL 8
- SSH access + sureapp CLI
- Stripe webhook URL: `https://your-domain.com/api/webhooks/stripe`

## Server directories

| Path | Purpose |
|------|---------|
| `/home/<user>/private/FOSL` | Git clone |
| `/home/<user>/private/fosl` | Live WebApps app (rsync target) |
| `uploads/` | Product images and digital assets |

## Manual deploy

```bash
sureapp project shell fosl
cd /home/<user>/private/FOSL
git fetch origin master --force && git checkout master && git reset --hard origin/master

rsync -a --delete \
  --exclude node_modules --exclude .next --exclude uploads --exclude .env \
  /home/<user>/private/FOSL/apps/hub/ \
  /home/<user>/private/fosl/

cd /home/<user>/private/fosl
npm install --include=dev
node ../../scripts/set-database-provider.mjs   # if db package present
npx prisma generate && npx prisma db push      # when DB ready

export LOW_MEMORY_BUILD=true
export NODE_OPTIONS=--max-old-space-size=768
export NEXT_TELEMETRY_DISABLED=1
npx next build

sureapp service manage --stop fosl
sureapp service manage --start fosl
```

**Critical:** Never rsync `.env` — it will break auth and database connections.

## Verify

| Check | Expected |
|-------|----------|
| `GET /api/health` | `200` with database connected |
| Hub | Role switcher works at `/` |
| Storefront | Products load (separate app or domain routing) |

## Background jobs

Use ICDSoft cron for catalog sync and Stripe reconciliation:

```bash
# Example cron entries
*/15 * * * * cd /home/<user>/private/fosl && npm run jobs:sync-catalog
0 2 * * * cd /home/<user>/private/fosl && npm run jobs:reconcile-stripe
```

## References

- [YooSupport DEPLOY-STEPS.md](e:\Code\UI\YooSupportUI\docs\DEPLOY-STEPS.md)
- [ICDSoft Running Next.js](https://www.icdsoft.com/en/kb/view/1141_running_next_js)
