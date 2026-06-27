#!/usr/bin/env sh
set -eu
REPO=/home/foslone/private/FOSL
cd "$REPO"

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

[ -n "$NODE_BIN" ] || { echo "ERROR: no running Node WebApp"; exit 1; }

export PATH="$(dirname "$NODE_BIN"):$REPO/node_modules/.bin:$PATH"
export NPM_CONFIG_CACHE="$REPO/.npm-cache"
export NODE_OPTIONS=--max-old-space-size=768
export NEXT_TELEMETRY_DISABLED=1
export NEXT_DEPLOYMENT_ID="$(git rev-parse --short HEAD)"
echo "NEXT_DEPLOYMENT_ID=$NEXT_DEPLOYMENT_ID"

rm -rf apps/platform/.next apps/storefront/.next
npm run build -w @fosl/platform
npm run build -w @fosl/storefront

fuser -k 26104/tcp 1629/tcp 2>/dev/null || true
sleep 3
sureapp service manage --stop Storefront 2>/dev/null || true
sureapp service manage --stop fosl-hub 2>/dev/null || true
sleep 3
sureapp service manage --start Storefront
sleep 12
sureapp service manage --start fosl-hub
sleep 12

W=$(curl -s http://127.0.0.1:26104/auth/sign-in | grep -oE 'webpack-[a-f0-9]+\.js' | head -1)
echo "hub-webpack=$W"
if [ -n "$W" ] && [ -f "apps/platform/.next/static/chunks/$W" ]; then
  echo "hub-chunk-OK"
else
  echo "hub-chunk-MISSING"
  exit 1
fi

S=$(curl -s http://127.0.0.1:1629/marketplace | grep -oE 'webpack-[a-f0-9]+\.js' | head -1)
echo "shop-webpack=$S"
if [ -n "$S" ] && [ -f "apps/storefront/.next/static/chunks/$S" ]; then
  echo "shop-chunk-OK"
else
  echo "shop-chunk-MISSING"
  exit 1
fi

curl -sI http://127.0.0.1:26104/auth/sign-in | head -1
curl -sI http://127.0.0.1:1629/marketplace | head -1
