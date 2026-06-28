#!/usr/bin/env sh
# Full ICDSoft deploy: atomic stop → wipe .next → build → verify chunks → start.
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
export NPM_CONFIG_CACHE="$REPO/.npm-cache"
mkdir -p "$NPM_CONFIG_CACHE"
echo "Using node: $NODE_BIN ($($NODE_BIN --version))"

test -f .env || { echo "ERROR: .env missing at $REPO/.env"; exit 1; }
grep -q '^DATABASE_URL=' .env || { echo "ERROR: DATABASE_URL missing in .env"; exit 1; }
grep -q '^AUTH_SECRET=' .env || { echo "ERROR: AUTH_SECRET missing in .env"; exit 1; }

kill_port() {
  port=$1
  pids=$(ss -tlnp 2>/dev/null | grep ":${port} " | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | sort -u)
  for pid in $pids; do
    echo "kill -9 pid=$pid port=$port"
    kill -9 "$pid" 2>/dev/null || true
  done
  fuser -k "${port}/tcp" 2>/dev/null || true
}

bash scripts/git-deploy-pull.sh

echo "=== stop services (before build) ==="
sureapp service manage --stop fosl-hub 2>/dev/null || true
sureapp service manage --stop Storefront 2>/dev/null || true
sureapp service manage --stop fosl-api 2>/dev/null || true
kill_port 26104
kill_port 1629
kill_port 21942
rm -rf apps/hub/.next apps/admin/.next
sleep 5

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
export NEXT_DEPLOYMENT_ID="$(git rev-parse --short HEAD)"
echo "NEXT_DEPLOYMENT_ID=$NEXT_DEPLOYMENT_ID"

echo "=== wipe old builds ==="
rm -rf apps/platform/.next apps/storefront/.next apps/api/.next

echo "=== building platform ==="
npm run build -w @fosl/platform
echo "=== building storefront ==="
npm run build -w @fosl/storefront
echo "=== building api ==="
npm run build -w @fosl/api

echo "=== starting services ==="
sureapp service manage --stop Storefront 2>/dev/null || true
sureapp service manage --stop fosl-api 2>/dev/null || true
sureapp service manage --stop fosl-hub 2>/dev/null || true
kill_port 26104
kill_port 1629
kill_port 21942
sleep 3

sureapp service manage --start Storefront || true
sleep 12
sureapp service manage --start fosl-api || true
sleep 12
sureapp service manage --start fosl-hub || true
sleep 15

echo "=== smoke tests ==="
curl -sI http://127.0.0.1:26104/auth/sign-in | head -1
curl -sI http://127.0.0.1:1629/marketplace | head -1
curl -sI http://127.0.0.1:21942/api/health | head -1

echo "=== chunk alignment gate ==="
bash scripts/icdsoft-health-check.sh

echo "=== deploy-full done $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
echo "Log: $LOG"
tail -25 "$LOG"
