"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration detector — false in SSR HTML / first client render, true after.
 *
 * The lint-clean replacement for the `useState(false)` + `useEffect(() =>
 * setMounted(true))` mount-guard idiom (react-hooks/set-state-in-effect):
 * useSyncExternalStore's server snapshot is the canonical way to branch on
 * "has hydrated" (same mechanism as usePrefersReducedMotion in this repo).
 * Used by sections whose motion `initial` must not bake opacity:0 into SSR.
 */
const emptySubscribe = () => () => {};

export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
