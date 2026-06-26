#!/usr/bin/env sh
# Stop crash-looping Node processes on FOSL ports, then start WebApps via sureapp.
# Run from plain SSH (not while supervisor is rapidly restarting).
# Usage: bash scripts/icdsoft-restart-services.sh
set -eu

HUB_PORT="${FOSL_HUB_PORT:-26104}"
SHOP_PORT="${FOSL_SHOP_PORT:-1629}"
API_PORT="${FOSL_API_PORT:-21942}"

echo "=== FOSL restart helper ==="
echo "Stop Storefront, fosl-api, and fosl-hub in the ICDSoft panel FIRST."
echo "Press Enter when all three show stopped, or Ctrl+C to abort."
read -r _

echo "Killing stale listeners on $HUB_PORT $SHOP_PORT $API_PORT ..."
fuser -k "${HUB_PORT}/tcp" 2>/dev/null || true
fuser -k "${SHOP_PORT}/tcp" 2>/dev/null || true
fuser -k "${API_PORT}/tcp" 2>/dev/null || true
sleep 3

ss -tlnp 2>/dev/null | grep -E "${HUB_PORT}|${SHOP_PORT}|${API_PORT}" || echo "All three ports free."

echo ""
echo "Starting services (Storefront shell)..."
sureapp service manage --start Storefront
sleep 5
sureapp service manage --start fosl-api
sleep 5
sureapp service manage --start fosl-hub
sleep 5

echo ""
bash "$(dirname "$0")/icdsoft-health-check.sh"
