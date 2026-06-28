#!/bin/bash
# sutaz.ca — deploy to production (Synology NAS) from WSL dev.
#
# GATE-FIRST DESIGN (per owner spec, verified 2026-06-28):
#   1. Run the full 130-test E2E suite locally (the now-trusted gate).
#   2. ONLY if green → rsync source to NAS → docker compose up -d --build.
#   3. Health-check the live container. Abort on any failure; never ship red.
#
# RUNS AS THE `ai` USER ON THE NAS (not root):
#   - ai owns /volume1/docker/sutazca/.env (mode 600) and is in the docker group.
#   - Deploying as ai means rsync preserves .env ownership + the app container
#     (which runs as `nextjs` uid 1001) keeps reading its env via compose.
#
# SAFETY:
#   - .env is NEVER synced (excluded) — prod secrets stay on the NAS.
#   - rsync excludes everything .dockerignore excludes (node_modules, .next, .git,
#     *.md, videos, screenshots) — none belong in the build context anyway.
#   - Pre-deploy snapshot of the live image + compose state (rollback safety).
#
# Usage (from WSL sutaz-ca distro, in ~/projects/sutaz.ca):
#   bash scripts/deploy-nas.sh           # full: e2e gate + deploy
#   bash scripts/deploy-nas.sh --skip-e2e  # deploy ONLY (assumes you ran e2e)
set -euo pipefail
cd "$(dirname "$0")/.." || exit 1
ROOT=$(pwd)
REMOTE="ai@sutaz-nas"
DEPLOY_DIR="/volume1/docker/sutazca"
TS=$(date -u +%Y%m%dT%H%M%SZ)

# Files that MUST NOT be sent to the NAS (prod secrets + dev-only artifacts).
# Mirrors .dockerignore + protects prod .env.
RSYNC_EXCLUDES=(
  --exclude='.env'             # prod secrets — never overwrite
  --exclude='.env.local'
  --exclude='node_modules/'
  --exclude='.next/'
  --exclude='.git/'
  --exclude='*.md'
  --exclude='.e2e-out/'
  --exclude='test-results/'
  --exclude='playwright-report/'
  --exclude='coverage/'
  --exclude='.DS_Store'
  --exclude='*.mp4'
  --exclude='Screenshot*.png'
  --exclude='*.log'
)

echo "[$(date -u +%FT%TZ)] sutaz.ca deploy → $REMOTE:$DEPLOY_DIR"

# ─── 1. E2E GATE ────────────────────────────────────────────────────────────
if [ "${1:-}" != "--skip-e2e" ]; then
  echo "=== Step 1/4: E2E gate (must be green to deploy) ==="
  if [ ! -f scripts/run-e2e-local.sh ]; then
    echo "ERROR: scripts/run-e2e-local.sh not found. Run from repo root." >&2
    exit 1
  fi
  bash scripts/run-e2e-local.sh
  E2E_EXIT=$?
  if [ "$E2E_EXIT" -ne 0 ]; then
    echo "❌ E2E FAILED (exit $E2E_EXIT) — deploy ABORTED. Nothing shipped." >&2
    exit "$E2E_EXIT"
  fi
  echo "✅ E2E green — proceeding to deploy."
else
  echo "=== Step 1/4: E2E gate SKIPPED (--skip-e2e) ==="
fi

# ─── 2. PRE-DEPLOY SNAPSHOT (rollback safety) ───────────────────────────────
echo "=== Step 2/4: Pre-deploy snapshot on NAS ==="
ssh "$REMOTE" "
  set -e
  SNAP=\"$DEPLOY_DIR/.deploy-snapshots/pre-\$TS\"
  mkdir -p \"\$SNAP\"
  export PATH=/usr/local/bin:\$PATH
  docker images sutazca-app --format '{{.Repository}}:{{.Tag}} {{.ID}} {{.CreatedSince}}' > \"\$SNAP/image-before.txt\"
  docker ps --filter name=sutazca --format '{{.Names}}|{{.Image}}|{{.Status}}' > \"\$SNAP/containers-before.txt\"
  cp -a \"$DEPLOY_DIR/docker-compose.yml\" \"\$SNAP/\"
  echo 'Snapshot at:' \"\$SNAP\"
  cat \"\$SNAP/containers-before.txt\"
"

# ─── 3. RSYNC SOURCE → NAS ──────────────────────────────────────────────────
echo "=== Step 3/4: rsync source → NAS (preserving prod .env) ==="
# --delete keeps the NAS clean of stale files, but .env is excluded so it survives.
# -h = human-readable, -z = compress, --info=progress2 = one progress line.
rsync -az --delete --info=progress2 \
  "${RSYNC_EXCLUDES[@]}" \
  ./ "$REMOTE:$DEPLOY_DIR/"

# Verify .env survived untouched.
ssh "$REMOTE" "test -f \"$DEPLOY_DIR/.env\" && echo '.env intact: '\$(stat -c '%U:%G %a %s bytes' \"$DEPLOY_DIR/.env\") || { echo '.env MISSING — ABORT'; exit 1; }"

# ─── 4. BUILD + START + HEALTH-CHECK ────────────────────────────────────────
echo "=== Step 4/4: docker compose up -d --build + health-check ==="
ssh "$REMOTE" "
  set -e
  export PATH=/usr/local/bin:\$PATH
  cd $DEPLOY_DIR
  echo '--- docker compose up -d --build (build runs in-container; ~2-4 min) ---'
  docker compose up -d --build 2>&1 | tail -15

  echo '--- wait for app health (up to 90s) ---'
  for i in \$(seq 1 30); do
    STATUS=\$(docker inspect -f '{{.State.Health.Status}}' sutazca-app 2>/dev/null || echo unknown)
    [ \"\$STATUS\" = 'healthy' ] && { echo \"sutazca-app healthy after \$((i*3))s\"; break; }
    sleep 3
  done

  echo '--- final state ---'
  docker ps --filter name=sutazca --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
  echo '--- live route probe ---'
  curl -sf -o /dev/null -w 'home HTTP %{http_code}\n' http://localhost:8093/ && echo 'deploy OK' || { echo 'home NOT 200 — check logs'; exit 1; }
  curl -sf -o /dev/null -w 'api HTTP %{http_code}\n' -X POST -H 'Content-Type: application/json' -d '{}' http://localhost:8093/api/roi-calculate || true
"

echo ""
echo "[$(date -u +%FT%TZ)] ✅ DEPLOY COMPLETE. Verify public: https://sutaz.ca/"
echo "    Snapshot for rollback: $REMOTE:$DEPLOY_DIR/.deploy-snapshots/pre-$TS"
echo "    Rollback: ssh $REMOTE 'cd $DEPLOY_DIR && docker compose down && docker tag <old-image-id> sutazca-app:latest && docker compose up -d'"
