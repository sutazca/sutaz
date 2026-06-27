/**
 * Database connection — server-only.
 *
 * Uses node-postgres (`pg`) with a single pooled client per process. The pool
 * connects as the least-privilege `sutaz_app` role (see
 * supabase/migrations/001_initial_schema.sql). All queries use parameterized
 * statements — no string interpolation of user input, ever.
 *
 * `server-only` guarantees this module never leaks into a client bundle
 * (would expose the DB credentials).
 */
import "server-only";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Fail fast at first query rather than silently degrading. Routes that
  // don't touch the DB (static pages) are unaffected.
  console.warn(
    "[db] DATABASE_URL is not set — database routes will return 503.",
  );
}

export const pool = new Pool({
  connectionString,
  // Pool sizing — modest, this is a low-traffic B2B site on a 2C/4T NAS.
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function dbHealthy(): Promise<boolean> {
  if (!connectionString) return false;
  try {
    const r = await pool.query("SELECT 1");
    return r.rowCount === 1;
  } catch {
    return false;
  }
}
