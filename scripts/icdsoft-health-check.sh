#!/usr/bin/env sh
# FOSL ICDSoft — check ports, HTTP smoke tests, and chunk/build alignment.
set -eu

REPO="${FOSL_REPO:-/home/foslone/private/FOSL}"
cd "$REPO"

HUB_PORT="${FOSL_HUB_PORT:-26104}"
SHOP_PORT="${FOSL_SHOP_PORT:-1629}"
API_PORT="${FOSL_API_PORT:-21942}"

echo "=== FOSL health check ($(date -u +%Y-%m-%dT%H:%M:%SZ)) ==="
echo "Repo: $REPO"
git log -1 --oneline 2>/dev/null || true
echo ""

check_port() {
  name=$1
  port=$2
  if ss -tlnp 2>/dev/null | grep -q ":${port} "; then
    echo "PORT $name ($port): LISTENING"
    ss -tlnp 2>/dev/null | grep ":${port} " || true
  else
    echo "PORT $name ($port): NOT LISTENING"
  fi
}

check_port hub "$HUB_PORT"
check_port shop "$SHOP_PORT"
check_port api "$API_PORT"
echo ""

http_check() {
  label=$1
  url=$2
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
  echo "HTTP $label: $code ($url)"
}

http_check "hub sign-in" "http://127.0.0.1:${HUB_PORT}/auth/sign-in"
http_check "shop marketplace" "http://127.0.0.1:${SHOP_PORT}/marketplace"
http_check "api health" "http://127.0.0.1:${API_PORT}/api/health"
echo ""

chunk_check() {
  app=$1
  port=$2
  path=$3
  html=$(curl -s "http://127.0.0.1:${port}${path}" 2>/dev/null || true)
  webpack=$(echo "$html" | grep -oE 'webpack-[^"]+\.js' | head -1 || true)
  if [ -z "$webpack" ]; then
    echo "CHUNK $app: no webpack ref in HTML"
    return
  fi
  if [ -f "$REPO/apps/${app}/.next/static/chunks/$webpack" ]; then
    echo "CHUNK $app: OK $webpack"
  else
    echo "CHUNK $app: MISSING $webpack (rebuild apps/${app})"
  fi
}

chunk_check platform "$HUB_PORT" "/auth/sign-in"
chunk_check storefront "$SHOP_PORT" "/marketplace"
chunk_check api "$API_PORT" "/api/health"
echo ""

if [ -f "$REPO/.env" ]; then
  echo "ENV .env: OK"
else
  echo "ENV .env: MISSING"
fi
echo "Done."
