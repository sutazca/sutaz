"use client";

import { useSyncExternalStore } from "react";

/**
 * Detect prefers-reduced-motion via useSyncExternalStore (SSR-safe, no
 * setState-in-effect — the canonical way to subscribe to a media query).
 *
 * Why a JS hook and not just CSS? The globals.css reduced-motion block only
 * neutralizes CSS `animation`/`transition`/`scroll-behavior`. It does NOT
 * affect <video autoPlay> or media swaps. For those (e.g. the hero orb video
 * → poster fallback), this hook is the correct detection. Verified against
 * web.dev/articles/prefers-reduced-motion (2026-06-29).
 *
 * Extracted from AnimatedCounter.tsx so the hero video path can reuse it
 * without duplicating the media-query plumbing.
 */
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

const subscribeReducedMotion = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const getReducedMotionSnapshot = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia(reducedMotionQuery).matches;

const getServerSnapshot = (): boolean => false;

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerSnapshot,
  );
}
