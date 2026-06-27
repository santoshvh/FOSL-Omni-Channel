#!/usr/bin/env sh
# Full ICDSoft deploy: pull, deps, migrate, optional seed, build all apps, restart, smoke test.
# Run inside sureapp project shell (fosl-hub or Storefront):
#   cd /home/foslone/private/FOSL && bash scripts/icdsoft-deploy-full.sh
set -eu
REPO=/home/foslone/private/FOSL
cd "$REPO"
LOG="$REPO/deploy-full.log"
exec >"$LOG" 2>&1
echo "=== deploy-full start $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="

node_from_port() {
  port=$1
  pid=$(ss -tlnp 2>/dev/null | grep ":${port} " | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | head -1)
  if [ -n "$pid" ] && [ -r "/proc/$pid/exe" ]; then
    readlink -f "/proc/$pid/exe" 2>/dev/null || true
  fi
}

NODE_BIN=""
for p in 26104 1629 21942; do
  NODE_BIN=$(node_from_port "$p")
  [ -n "$NODE_BIN" ] && break
done

if [ -z "$NODE_BIN" ] || [ ! -x "$NODE_BIN" ]; then
  echo "ERROR: Could not find Node from running WebApps. Start a service first or run inside sureapp shell."
  exit 1
fi

NODE_DIR=$(dirname "$NODE_BIN")
export PATH="$NODE_DIR:$REPO/node_modules/.bin:$PATH"
echo "Using node: $NODE_BIN ($($NODE_BIN --version))"

test -f .env || { echo "ERROR: .env missing at $REPO/.env"; exit 1; }
grep -q '^DATABASE_URL=' .env || { echo "ERROR: DATABASE_URL missing in .env"; exit 1; }
grep -q '^AUTH_SECRET=' .env || { echo "ERROR: AUTH_SECRET missing in .env"; exit 1; }

bash scripts/git-deploy-pull.sh

echo "=== npm ci ==="
npm ci

echo "=== db generate ==="
npm run db:generate

echo "=== db migrate ==="
npm run db:migrate:deploy

if [ "${SKIP_SEED:-}" != "1" ]; then
  echo "=== db seed ==="
  npm run db:seed
else
  echo "=== db seed skipped (SKIP_SEED=1) ==="
fi

export NODE_OPTIONS=--max-old-space-size=768
export NEXT_TELEMETRY_DISABLED=1
export LOW_MEMORY_BUILD=true

echo "=== building platform ==="
npm run build -w @fosl/platform
echo "=== building storefront ==="
npm run build -w @fosl/storefront
echo "=== building api ==="
npm run build -w @fosl/api

echo "=== restarting services ==="
fuser -k 26104/tcp 1629/tcp 21942/tcp 2>/dev/null || true
sleep 5

sureapp service manage --stop Storefront 2>/dev/null || true
sureapp service manage --stop fosl-api 2>/dev/null || true
sureapp service manage --stop fosl-hub 2>/dev/null || true
sleep 3

sureapp service manage --start Storefront || true
sleep 10
sureapp service manage --start fosl-api || true
sleep 10
sureapp service manage --start fosl-hub || true
sleep 15

echo "=== smoke tests ==="
curl -sI http://127.0.0.1:26104/auth/sign-in | head -1
curl -sI http://127.0.0.1:1629/marketplace | head -1
curl -sI http://127.0.0.1:21942/api/health | head -1
curl -s https://hub.foslone.com/auth/sign-in | head -c 80 || true
echo ""
curl -s https://shop.foslone.com/api/v1/products | head -c 200 || true
echo ""

bash scripts/icdsoft-health-check.sh || true

echo "=== deploy-full done $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
echo "Log: $LOG"
tail -20 "$LOG"
