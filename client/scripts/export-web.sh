#!/usr/bin/env bash
set -euo pipefail

echo "[export:web] starting expo export (platform=web, max-workers=2)..."

(
  while true; do
    sleep 30
    echo "[export:web] still bundling... $(date -u +%H:%M:%S)"
  done
) &
heartbeat_pid=$!
trap 'kill "$heartbeat_pid" 2>/dev/null || true' EXIT

npx expo export --platform web --output-dir dist --max-workers 2

kill "$heartbeat_pid" 2>/dev/null || true
trap - EXIT

echo "[export:web] stamping service worker..."
node scripts/stamp-sw.mjs
echo "[export:web] done"
