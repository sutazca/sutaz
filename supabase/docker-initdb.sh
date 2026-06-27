#!/usr/bin/env bash
# ============================================================================
# First-boot DB initialization (runs in the postgres container via
# docker-entrypoint-initdb.d on initial volume creation only — NOT on restart).
#
# Order: schema -> set sutaz_app password -> seed (deduplicated).
# Idempotent guards make a re-run safe (won't double-seed).
# ============================================================================
set -eu

DB=sutazca
# The compose file mounts migrations at /migrations and seed at /seed.sql.
SCHEMA=/migrations/001_initial_schema.sql
SEED=/seed.sql

echo "[initdb] applying schema..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB" -f "$SCHEMA"

echo "[initdb] setting sutaz_app password..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB" \
  -c "ALTER ROLE sutaz_app WITH PASSWORD '${POSTGRES_APP_PASSWORD}';"

# Idempotent seed guard — only seed if the table is empty.
ALREADY=$(psql -t -A --username "$POSTGRES_USER" --dbname "$DB" \
  -c "SELECT count(*) FROM leads;")
if [ "${ALREADY:-0}" -gt 0 ]; then
  echo "[initdb] leads table already has ${ALREADY} rows — skipping seed."
else
  echo "[initdb] seeding deduplicated leads..."
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB" -f "$SEED" >&2
fi

echo "[initdb] done."
