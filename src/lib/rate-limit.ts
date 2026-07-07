/**
 * Sliding-window rate limiter for public POST endpoints (/api/leads).
 *
 * Pure function over a module-level Map so it is unit-testable (see
 * e2e/validations.spec.ts) and needs zero infrastructure.
 * ponytail: in-memory, single-container deploy; move to Postgres/redis if
 * this ever scales horizontally.
 */
const hits = new Map<string, number[]>();

/**
 * Returns true when the caller identified by `key` is still within
 * `max` requests per `windowMs`. Records the hit when allowed.
 */
export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
  now: number = Date.now(),
): boolean {
  const cutoff = now - windowMs;
  const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

/** Test helper — clears all recorded hits. */
export function resetRateLimit(): void {
  hits.clear();
}
