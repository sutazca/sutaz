# sutaz.ca — Design System Source of Truth

This file is the canonical reference for the sutaz.ca design system. Any agent
or human editing the site must keep changes consistent with the rules below.
Inspired by the VoltAgent DESIGN.md convention (token + rule + rationale in one
file) so the system stays disciplined as it grows.

## Intent
**Engineering-Luxury.** A dark, premium B2B automation-agency site that reads as
engineered precision, not a generic template. Single teal accent on dominant
navy. Fraunces serif for display; Geist grotesque for body; JetBrains Mono for
numerals and labels. Motion is restrained and purposeful.

## Palette (globals.css @theme)
| Token | Value | Use |
|-------|-------|-----|
| Page background | `navy-500` (#04060c-ish, gradient) | base layer |
| Card surface | `#131a2e` (`.glass-card`) | elevated cards |
| Recessed surface | `#0e1223` (`.surface-recessed`) | inset terminals / service cards |
| Border strong | `rgb(148 163 184 / 0.22)` | card + panel hairlines |
| Accent | teal scale (`teal-700` for AA-contrast CTAs) | single brand accent |
| Text | white / slate-300 / slate-400 (AA on navy) | never slate-500/600 on dark |

**Rule:** exactly one accent color (teal). Never introduce a second hue for UI.
Pain/cure uses structural color coding (red/teal left-rules), not full-color fills.

## Depth layering (critical)
`page bg` < `.surface-recessed` (inset, deeper) < `.glass-card` (elevated) <
`.card-moat` (teal glow, the flagship differentiator). Each layer is visually
distinct so cards never read as flat.

## Typography
- Display: Fraunces, `opsz 144`, tracking -0.025em, line-height 1.05, `text-wrap: balance`.
- Body: Geist, 65ch max, line-height 1.5-1.6.
- Numerals: `tabular-nums` globally (stable digit width — no count-up jitter).
- Type scale: Major Third 1.25.

## Motion rules (the detail that separates premium from generic)
- **Icon morph** on state change: `filter: blur(2px)→0`, `opacity: 0→1`, `scale: 0.8→1`,
  0.15s easeOut, `AnimatePresence mode="popLayout"`.
- **Rotating text** (TextFlip): `AnimatePresence mode="wait"`, y:-8→0→8, ~2.4s interval.
- **Entrance reveals**: SSR-safe (gate `initial` behind `mounted` to avoid the
  opacity:0 SSR trap), stagger 0.08s, ease `[0.16,1,0.3,1]`.
- **Cursor spotlight**: radial-gradient following `--mx/--my`, only on hover.
- **Max 1-2 animated elements per viewport** at rest (ux-guidelines #7).
- **`prefers-reduced-motion`**: honored globally (animation-duration 0.01ms).
- Easing standard: `[0.16, 1, 0.3, 1]` (smooth settle-out).

## Accessibility (WCAG 2.2 AA — verified, 0 axe violations)
- CTA contrast: white on `teal-700` = 5.47:1 ✓ (teal-600 = 3.74 ✗, do not use).
- Every page: exactly one `<h1>`.
- Touch targets: min 44×44px (`min-h-[44px]`).
- Focus-visible: 2px teal outline, offset 3px.
- Skip link present + focusable.
- Color is never the sole signal (icons + text accompany color).

## Performance (Core Web Vitals — verified)
- LCP, FCP: well within thresholds.
- CLS: font-fallback chain + `text-wrap: balance` prevent heading collapse.
  Measure post-settle (Next.js streams RSC; DCL-time CLS is an artifact).
- No long tasks > 200ms.

## Component conventions
- Cards: prefer `.glass-card` / `.surface-recessed` / `.card-moat` over bespoke.
- CTAs: use `<Button variant="primary">` (teal-700, glow-teal) or the AnimatedArrow.
- Avoid inline-hex `style` objects for color — use tokens / Tailwind classes.
- Verbatim copy lives in `src/lib/content.ts`; computed counts in
  `src/lib/service-catalog.ts` (never hardcode service counts).
