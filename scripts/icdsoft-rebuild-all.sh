#!/usr/bin/env sh
set -eu
REPO=/home/foslone/private/FOSL
cd "$REPO"
LOG="$REPO/rebuild.log"
exec >"$LOG" 2>&1
echo "=== rebuild start $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="

# Plain SSH has no Node — borrow it from a running next-server (ICDSoft sureapp).
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
  echo "ERROR: Could not find Node from running WebApps. Run inside: sureapp project shell fosl-hub"
  exit 1
fi

NODE_DIR=$(dirname "$NODE_BIN")
export PATH="$NODE_DIR:$REPO/node_modules/.bin:$PATH"
echo "Using node: $NODE_BIN ($($NODE_BIN --version))"

git fetch origin refactor/two-app-platform --force
git reset --hard origin/refactor/two-app-platform
git log -1 --oneline

export NODE_OPTIONS=--max-old-space-size=768
export NEXT_TELEMETRY_DISABLED=1
export NEXT_DEPLOYMENT_ID="$(git rev-parse --short HEAD)"
echo "NEXT_DEPLOYMENT_ID=$NEXT_DEPLOYMENT_ID"

echo "=== building platform ==="
npm run build -w @fosl/platform
echo "=== building storefront ==="
npm run build -w @fosl/storefront
echo "=== building api ==="
npm run build -w @fosl/api

ls apps/platform/.next/static/chunks/webpack*.js
ls apps/storefront/.next/static/chunks/webpack*.js

echo "=== restarting services ==="
fuser -k 26104/tcp 1629/tcp 21942/tcp 2>/dev/null || true
sleep 5

sureapp service manage --start Storefront || true
sleep 10
sureapp service manage --start fosl-api || true
sleep 10
sureapp service manage --start fosl-hub || true
sleep 10

echo "=== smoke tests ==="
curl -sI http://127.0.0.1:26104/auth/sign-in | head -1
curl -sI http://127.0.0.1:1629/marketplace | head -1
curl -sI http://127.0.0.1:21942/api/health | head -1
curl -s https://api.foslone.com/api/health || true
echo ""
echo "=== rebuild done $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
