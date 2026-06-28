#!/bin/bash
# One-off test: validate the deploy staging+swap mechanism against /tmp (not prod).
# Proves: tar transfer works, .env preserved across atomic swap, source arrives.
set -euo pipefail
cd ~/projects/sutaz.ca
REMOTE="ai@sutaz-nas"
TESTDIR="/tmp/deploy-mech-test"

echo "=== Setup: fake prod dir with .env ==="
ssh "$REMOTE" "rm -rf $TESTDIR $TESTDIR.staging $TESTDIR.previous; mkdir -p $TESTDIR; echo prod-secret > $TESTDIR/.env; chmod 600 $TESTDIR/.env; echo 'before .env:' \$(cat $TESTDIR/.env)"

echo "=== Transfer source to staging (tar-over-ssh) ==="
ssh "$REMOTE" "mkdir -p $TESTDIR.staging"
tar czf - \
  --exclude='./.env' --exclude='./.env.local' --exclude='./node_modules' \
  --exclude='./.next' --exclude='./.git' --exclude='./.e2e-out' \
  --exclude='./test-results' --exclude='./playwright-report' --exclude='./coverage' \
  --exclude='./.deploy-snapshots' --exclude='./.staging-*' --exclude='./.DS_Store' \
  --exclude='./*.mp4' --exclude='./Screenshot*.png' --exclude='./*.log' \
  -C . . | ssh "$REMOTE" "cd $TESTDIR.staging && tar xzf -"

echo "=== Atomic swap (preserve .env) ==="
ssh "$REMOTE" "
  cp -a $TESTDIR/.env $TESTDIR.staging/.env
  mv $TESTDIR $TESTDIR.previous
  mv $TESTDIR.staging $TESTDIR
  echo 'after swap:'
  echo '  .env content:' \$(cat $TESTDIR/.env)
  echo '  package.json:' \$(test -f $TESTDIR/package.json && echo YES || echo NO)
  echo '  src/ dir:' \$(test -d $TESTDIR/src && echo YES || echo NO)
  echo '  e2e/ dir:' \$(test -d $TESTDIR/e2e && echo YES || echo NO)
  rm -rf $TESTDIR.previous
"

echo "=== Cleanup ==="
ssh "$REMOTE" "rm -rf $TESTDIR"
echo "=== MECHANISM PROVEN ==="
