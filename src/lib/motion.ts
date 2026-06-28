/**
 * Shared motion tokens for sutaz.ca.
 *
 * Centralizes the easing cubic-bezier previously redeclared across ~10
 * components (HeroSection, StatsBand, FinalCTA, ProblemSolution, HowWeBuild,
 * EcosystemPreview, WorkflowDiagram, Navbar, FaqAccordion, text-flip).
 *
 * Per DESIGN-ELEVATION.md §3, this is THE approved easing for all site motion.
 * Honored by the prefers-reduced-motion kill-switch in globals.css.
 *
 * NOTE: transition *objects* (durations, delays, variants) are intentionally
 * NOT centralized — they differ per use-site, so only the shared easing tuple
 * lives here. Pure refactor: importing this must not change any animation.
 */
import type { Transition } from "motion/react";

/**
 * Signature ease-out-expo curve.
 * `as const` yields a readonly tuple assignable to motion's `Transition["ease"]`.
 */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Convenience: a default fade transition with this easing.
 * Used by sites that need a `Transition`-shaped value (Navbar, FaqAccordion,
 * text-flip default param). Optional — sites may also just inline `ease`.
 */
export const fadeTransition = (duration = 0.3): Transition => ({
  duration,
  ease: EASE_OUT_EXPO,
});
