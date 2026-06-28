#!/bin/bash
# sutaz.ca — serve the production standalone server for E2E.
#
# WHY THIS EXISTS (verified 2026-06-28):
# `next start` is INCOMPATIBLE with `output: "standalone"` in next.config.ts.
# The server boots ("Ready in Nms") but every route HANDLER hangs (static pages
# still serve). `next start` itself logs the warning:
#   ⚠ "next start" does not work with "output: standalone" configuration.
#     Use "node .next/standalone/server.js" instead.
# This script runs the correct server. Must be run AFTER `next build --webpack`.
#
# Stages .next/static + public next to the standalone server (Next.js docs).
set -euo pipefail
PORT=${PORT:-3999}
HOSTNAME=${HOSTNAME:-127.0.0.1}

if [ ! -f ".next/standalone/server.js" ]; then
  echo "ERROR: .next/standalone/server.js not found. Run 'next build --webpack' first." >&2
  exit 1
fi

# Standalone expects static assets beside it (Next.js deploying docs).
cp -rT .next/static .next/standalone/.next/static
cp -rT public .next/standalone/public 2>/dev/null || true

cd .next/standalone
exec env PORT="$PORT" HOSTNAME="$HOSTNAME" node server.js
