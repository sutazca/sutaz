#!/bin/bash
# sutaz.ca — local E2E runner (WSL dev environment)
#
# Runs the full Playwright + axe suite against a REAL production build, the way
# the deploy gate requires. Uses the standalone server (node .next/standalone/
# server.js) because `next start` is INCOMPATIBLE with output:"standalone" —
# the server boots but route handlers hang. Verified 2026-06-28.
#
# Usage (from WSL sutaz-ca distro, in the project root):
#   bash scripts/run-e2e-local.sh
set +e
cd "$(dirname "$0")/.." || exit 1
ROOT=$(pwd)
LOG=/tmp/e2e-result.log
SRVLOG=/tmp/e2e-server.log
PORT=${E2E_PORT:-3999}

echo "[$(date -u +%FT%TZ)] E2E run (standalone server, sequential 1 worker)" | tee "$LOG"

# 1. Build
echo "=== Build (next build --webpack) ===" | tee -a "$LOG"
node node_modules/next/dist/bin/next build --webpack >> "$LOG" 2>&1
BUILD_EXIT=$?
echo "BUILD_EXIT=$BUILD_EXIT" | tee -a "$LOG"
[ "$BUILD_EXIT" -ne 0 ] && { echo "BUILD FAILED — abort" | tee -a "$LOG"; exit 1; }

# 2. Standalone server requires the static dir copied next to it (Next.js docs).
#    next build produces .next/standalone + .next/static; standalone expects
#    .next/standalone/.next/static + .next/standalone/public.
echo "=== Stage standalone static + public ===" | tee -a "$LOG"
cp -rT .next/static .next/standalone/.next/static 2>>"$LOG"
cp -rT public .next/standalone/public 2>>"$LOG" || true

# 3. Start server (standalone)
echo "=== Start standalone server on :$PORT ===" | tee -a "$LOG"
cd .next/standalone
PORT=$PORT HOSTNAME=127.0.0.1 node server.js > "$SRVLOG" 2>&1 &
SERVER_PID=$!
cd "$ROOT"
echo "server PID: $SERVER_PID" | tee -a "$LOG"

# 4. Wait + probe EVERY route before tests (hard gate — no tests if server broken)
for i in $(seq 1 40); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "http://127.0.0.1:$PORT/" 2>/dev/null)
  [ "$CODE" = "200" ] && break
  sleep 1
done
echo "home: HTTP $CODE (after up to ${i}s)" | tee -a "$LOG"

echo "=== Pre-test route probe (all routes must respond) ===" | tee -a "$LOG"
ALL_OK=1
for p in / /services /ecosystems /lab /contact /privacy /terms \
         /sitemap.xml /api/leads /api/roi-calculate; do
  if [ "$p" = "/api/leads" ] || [ "$p" = "/api/roi-calculate" ]; then
    # POST with invalid body → expect 400 (proves route handler is alive)
    C=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}s" --max-time 8 \
        -X POST -H "Content-Type: application/json" -d '{}' \
        "http://127.0.0.1:$PORT$p" 2>/dev/null)
  else
    C=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}s" --max-time 10 \
        "http://127.0.0.1:$PORT$p" 2>/dev/null)
  fi
  echo "  $p -> $C" | tee -a "$LOG"
  case "$C" in 000*) ALL_OK=0;; esac
done

if [ "$CODE" != "200" ] || [ "$ALL_OK" -ne 1 ]; then
  echo "SERVER NOT HEALTHY — aborting (see probe above)" | tee -a "$LOG"
  echo "--- server log ---" | tee -a "$LOG"; tail -20 "$SRVLOG" | tee -a "$LOG"
  kill "$SERVER_PID" 2>/dev/null
  echo "ABORT_EXIT=1" | tee -a "$LOG"; exit 1
fi

# 5. Run the full suite (sequential — deterministic for a deploy gate)
echo "=== Run Playwright (1 worker, deterministic) ===" | tee -a "$LOG"
node node_modules/@playwright/test/cli.js test --workers=1 >> "$LOG" 2>&1
E2E_EXIT=$?
echo "E2E_EXIT=$E2E_EXIT" | tee -a "$LOG"

# 6. Cleanup
echo "=== Cleanup ===" | tee -a "$LOG"
kill "$SERVER_PID" 2>/dev/null
wait "$SERVER_PID" 2>/dev/null
echo "[$(date -u +%FT%TZ)] DONE (E2E_EXIT=$E2E_EXIT)" | tee -a "$LOG"
exit "$E2E_EXIT"
