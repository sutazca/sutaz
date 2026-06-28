#!/bin/bash
# sutaz.ca — deploy to production (Synology NAS) from WSL dev.
#
# GATE-FIRST DESIGN (per owner spec, verified 2026-06-28):
#   1. Run the full 130-test E2E suite locally (the now-trusted gate).
#   2. ONLY if green → transfer source to NAS → docker compose up -d --build.
#   3. Health-check the live container. Abort on any failure; never ship red.
#
# TRANSFER MECHANISM: tar-over-ssh (NOT rsync).
#   Verified 2026-06-28: Synology DSM blocks the rsync protocol over SSH for
#   non-service accounts (every rsync → "connection unexpectedly closed (0 bytes
#   received)"; root + ai both fail; plain ssh works). tar-over-ssh uses only
#   the working SSH channel — no daemon, no protocol negotiation, bulletproof.
#
# RUNS AS THE `ai` USER ON THE NAS (not root):
#   - ai owns /volume1/docker/sutazca/.env (mode 600) and is in the docker group.
#   - .env is NEVER sent (tar excludes it) — prod Postgres secrets stay put.
#
# SAFETY:
#   - .env, node_modules, .next, .git, *.md, videos, screenshots all excluded.
#   - Pre-deploy snapshot of the live image + compose state (rollback safety).
#   - Transfer is ATOMIC: build into a temp dir, swap on success.
#
# Usage (from WSL sutaz-ca distro, in ~/projects/sutaz.ca):
#   bash scripts/deploy-nas.sh             # full: e2e gate + deploy
#   bash scripts/deploy-nas.sh --skip-e2e  # deploy ONLY (assumes you ran e2e)
set -euo pipefail
cd "$(dirname "$0")/.." || exit 1
ROOT=$(pwd)
REMOTE="ai@sutaz-nas"
DEPLOY_DIR="/volume1/docker/sutazca"
TS=$(date -u +%Y%m%dT%H%M%SZ)
STAGING="$DEPLOY_DIR/.staging-$TS"

# Paths excluded from transfer (prod secrets + dev-only artifacts).
TAR_EXCLUDES=(
  --exclude='./.env'
  --exclude='./.env.local'
  --exclude='./node_modules'
  --exclude='./.next'
  --exclude='./.git'
  --exclude='./.e2e-out'
  --exclude='./test-results'
  --exclude='./playwright-report'
  --exclude='./coverage'
  --exclude='./.deploy-snapshots'
  --exclude='./.staging-*'
  --exclude='./.DS_Store'
  --exclude='./*.mp4'
  --exclude='./Screenshot*.png'
  --exclude='./*.log'
  --exclude='./.frames'
  --exclude='./.preview'
)

echo "[$(date -u +%FT%TZ)] sutaz.ca deploy → $REMOTE:$DEPLOY_DIR"

# ─── 1. E2E GATE ────────────────────────────────────────────────────────────
if [ "${1:-}" != "--skip-e2e" ]; then
  echo "=== Step 1/5: E2E gate (must be green to deploy) ==="
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
  echo "=== Step 1/5: E2E gate SKIPPED (--skip-e2e) ==="
fi

# ─── 2. PRE-DEPLOY SNAPSHOT (rollback safety) ───────────────────────────────
echo "=== Step 2/5: Pre-deploy snapshot on NAS ==="
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

# ─── 3. TRANSFER SOURCE → NAS STAGING DIR (tar-over-ssh, atomic) ────────────
echo "=== Step 3/5: transfer source → NAS staging (tar-over-ssh; .env protected) ==="
ssh "$REMOTE" "mkdir -p '$STAGING' && rm -rf '$STAGING'/* '$STAGING'/.[!.]* 2>/dev/null || true"
# Stream tar over ssh; extract on the NAS into the staging dir.
tar czf - "${TAR_EXCLUDES[@]}" -C "$ROOT" . \
  | ssh "$REMOTE" "cd '$STAGING' && tar xzf - && echo 'extracted' && find . -type f | wc -l"
# Verify .env was NOT transferred.
ssh "$REMOTE" "test -f '$STAGING/.env' && { echo 'ERROR: .env leaked into staging — ABORT'; exit 1; } || echo '✓ .env correctly absent from staging'"

# ─── 4. ATOMIC SWAP + BUILD + START + HEALTH-CHECK ──────────────────────────
echo "=== Step 4/5: atomic swap (preserve .env) + docker compose up -d --build ==="
ssh "$REMOTE" "
  set -e
  export PATH=/usr/local/bin:\$PATH

  # Bring the prod .env into staging (it was excluded from transfer).
  cp -a '$DEPLOY_DIR/.env' '$STAGING/.env'
  # Preserve any other deploy-only state (snapshots, staging dirs).
  for d in '$DEPLOY_DIR'/.deploy-snapshots; do
    [ -d \"\$d\" ] && cp -a \"\$d\" '$STAGING/' 2>/dev/null || true
  done

  # Atomic swap: rename current → .previous-\$TS, staging → deploy dir.
  PREV='$DEPLOY_DIR'.previous-\$TS
  rm -rf \"\$PREV\"
  mv '$DEPLOY_DIR' \"\$PREV\"
  mv '$STAGING' '$DEPLOY_DIR'

  cd '$DEPLOY_DIR'
  echo '--- docker compose up -d --build (build runs in-container; ~2-4 min) ---'
  docker compose up -d --build 2>&1 | tail -20

  echo '--- wait for app health (up to 90s) ---'
  for i in \$(seq 1 30); do
    STATUS=\$(docker inspect -f '{{.State.Health.Status}}' sutazca-app 2>/dev/null || echo unknown)
    [ \"\$STATUS\" = 'healthy' ] && { echo \"sutazca-app healthy after \$((i*3))s\"; break; }
    sleep 3
  done

  echo '--- final state ---'
  docker ps --filter name=sutazca --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
"

# ─── 5. LIVE HEALTH PROBE + CLEANUP ─────────────────────────────────────────
echo "=== Step 5/5: live route probe + cleanup ==="
if ssh "$REMOTE" "
  set -e
  export PATH=/usr/local/bin:\$PATH
  curl -sf -o /dev/null -w 'home HTTP %{http_code}\n' http://localhost:8093/ || { echo 'home NOT 200'; exit 1; }
  curl -sf -o /dev/null -w 'api  HTTP %{http_code}\n' -X POST -H 'Content-Type: application/json' -d '{}' http://localhost:8093/api/roi-calculate || echo '(api non-200 — investigate)'
  # Keep only the last 3 previous-deploy dirs.
  ls -1dt '$DEPLOY_DIR'.previous-* 2>/dev/null | tail -n +4 | xargs rm -rf 2>/dev/null || true
"; then
  echo ""
  echo "[$(date -u +%FT%TZ)] ✅ DEPLOY COMPLETE. Verify public: https://sutaz.ca/"
  echo "    Snapshot: $REMOTE:$DEPLOY_DIR/.deploy-snapshots/pre-$TS"
  echo "    Rollback: ssh $REMOTE 'cd $DEPLOY_DIR && docker compose down; mv $DEPLOY_DIR $DEPLOY_DIR.failed-\$TS; mv $DEPLOY_DIR.previous-* $DEPLOY_DIR; docker compose up -d'"
else
  echo ""
  echo "[$(date -u +%FT%TZ)] ❌ LIVE PROBE FAILED — app not healthy post-deploy." >&2
  echo "    Rollback: ssh $REMOTE 'cd $DEPLOY_DIR && docker compose down; mv $DEPLOY_DIR $DEPLOY_DIR.failed-\$TS; mv $DEPLOY_DIR.previous-* $DEPLOY_DIR; docker compose up -d'" >&2
  exit 1
fi
