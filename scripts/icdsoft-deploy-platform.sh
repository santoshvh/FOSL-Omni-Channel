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

if [ -z "$NODE_BIN" ]; then
  echo "ERROR: no running Node WebApp found"
  exit 1
fi

export PATH="$(dirname "$NODE_BIN"):$REPO/node_modules/.bin:$PATH"
echo "Using node: $NODE_BIN"

git fetch origin refactor/two-app-platform --force
git reset --hard origin/refactor/two-app-platform
git log -1 --oneline

export NODE_OPTIONS=--max-old-space-size=768
export NEXT_TELEMETRY_DISABLED=1

rm -rf apps/platform/.next
npm run build -w @fosl/platform

fuser -k 26104/tcp 2>/dev/null || true
sleep 3

sureapp service manage --start fosl-hub
sleep 8

echo "=== smoke ==="
curl -sI http://127.0.0.1:26104/auth/sign-in | head -1
curl -sI -H "Host: hub.foslone.com" http://127.0.0.1:26104/admin | head -5
