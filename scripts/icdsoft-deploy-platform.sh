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

kill_port() {
  port=$1
  pids=$(ss -tlnp 2>/dev/null | grep ":${port} " | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | sort -u)
  for pid in $pids; do
    kill -9 "$pid" 2>/dev/null || true
  done
  fuser -k "${port}/tcp" 2>/dev/null || true
}

sureapp service manage --stop fosl-hub 2>/dev/null || true
kill_port 26104
sleep 3
ss -tlnp 2>/dev/null | grep ":26104 " && echo "WARN: port 26104 still in use" || echo "Port 26104 free"

sureapp service manage --start fosl-hub
sleep 20

echo "=== smoke ==="
curl -sI http://127.0.0.1:26104/auth/sign-in | head -1
curl -sI -H "Host: hub.foslone.com" http://127.0.0.1:26104/admin | tr -d '\r' | head -6
curl -sI https://hub.foslone.com/admin | tr -d '\r' | head -6
