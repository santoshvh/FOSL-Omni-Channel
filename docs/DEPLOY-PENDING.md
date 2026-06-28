# Pending ICDSoft deployment

Track changes queued since the last successful production deploy (`36dbb3e` on server with manual chunk fix). **Do not deploy until all planned changes are complete.**

## Commits pending deploy (newest first)

| Commit | Summary |
|--------|---------|
| _(pending)_ | Storefront customer login, SoComOTT URL, remove duplicate Marketplace |
| `f6dd500` | Hub user menu, in-app notifications |
| `f234a49` | Referral clicks without marketing consent; cookie only when opted in |
| `752df14` | Marketplace cart fix + referral code resolution |
| `4b137df` | Deploy script hard-kill stale Next PIDs after `sureapp stop` |

## Database migrations to run

Apply in order on server after `git pull`:

1. `20250627120000_creator_link_featured` — `featured`, `featuredOrder` on `creator_links`
2. `20250627140000_user_notifications` — `user_notifications` table

```bash
cd /home/foslone/private/FOSL
npm run db:migrate:deploy
npm run db:seed   # optional: demo notifications + featured link pins
```

## Deploy command (when ready)

One command at a time over SSH to reduce load:

```powershell
# 1. Pull
ssh fosl-icdsoft 'cd /home/foslone/private/FOSL && git pull origin refactor/two-app-platform'

# 2. Migrate
ssh fosl-icdsoft 'cd /home/foslone/private/FOSL && npm run db:migrate:deploy'

# 3. Full atomic deploy (includes npm ci, build all apps, kill_port fix, health gate)
ssh fosl-icdsoft 'cd /home/foslone/private/FOSL && sed -i "s/\r$//" scripts/icdsoft-deploy-full.sh && bash scripts/icdsoft-deploy-full.sh'

# 4. Verify (after deploy finishes)
ssh fosl-icdsoft 'cd /home/foslone/private/FOSL && bash scripts/icdsoft-health-check.sh'
```

Or run `bash scripts/icdsoft-deploy-full.sh` inside a sureapp shell (see [DEPLOYMENT-ICDSOFT.md](./DEPLOYMENT-ICDSOFT.md)).

## Post-deploy smoke tests

| URL | Expect |
|-----|--------|
| https://hub.foslone.com/creator/profile | Product images load; public profile URL shown |
| https://shop.foslone.com/creators/ALEX2026 | Public creator page with featured products |
| https://shop.foslone.com/marketplace/products/prod_5?ref=ALEX2026&add=1 | Product added to cart |
| https://hub.foslone.com/creator/links | Cards/table toggle; star to feature |
| https://shop.foslone.com/login | Customer sign-in stays on shop (not hub) |
| Header nav | Single Marketplace link; SoComOTT → socomott.com/net_channel/fosl |

Login: `alex@acmecatalog.com` / `demo123`

## Notes

- SSH to ICDSoft can timeout; retry with `ConnectTimeout=120`.
- `sureapp stop` alone may leave stale Node PIDs — deploy script now uses `kill -9` on port listeners.
- Platform hub must be rebuilt for user menu + notifications API.
