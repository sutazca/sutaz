# DESIGN-ELEVATION.md — Engineering-Luxury v2

**Status:** APPROVED 2026-06-28 (owner sign-off on §2 thesis, §5 tokens, §7 risks;
imagery policy added in §4.4 per owner direction).
**Derived from:** `DESIGN.md` (canonical, preserved) + frame-by-frame analysis of the
owner-supplied reference video (`WhatsApp Video 2026-06-28 at 2.51.30 AM (1).mp4`).
**Date:** 2026-06-28

This is an *addendum* to `DESIGN.md`, not a replacement. Where the two conflict,
this file governs for the v2 elevation work. `DESIGN.md`'s palette, fonts, depth
rules, and accessibility constraints remain binding unless explicitly overridden
here.

---

## 1. What the reference video is (verified, not assumed)

A TikTok from `@webloved` titled *"Can you believe Lovable did this?"* — a
showcase of a website built by **Lovable** (AI app builder). The site is for a
Japanese aesthetic/craft/wellness organization. Verified across 8 extracted
frames (forest hero, "Who we are", "School", "Craft", "Philosophy" sections).

**The reference's design language (the part worth borrowing):**
- Full-bleed atmospheric photography as the hero — the image IS the hero.
- Extreme minimalism: one dominant element per viewport, near-zero UI chrome.
- Editorial/magazine spacing: 80–100px section gaps, line-height 1.6–1.8.
- Near-black backgrounds (`#1a1a1a`), white text, muted earth-tone imagery.
- Large clean sans-serif headings (~32–48px in their context).
- Content-first vertical narrative — each section is a single idea, fully breathed.

**The reference's content (NOT borrowed — wrong business):**
- Forest/craft/hands photography, poetic wellness copy, "story" narrative.
sutaz.ca is a B2B engineering agency; that content does not transfer.

## 2. The elevation thesis

> **Borrow the reference's *discipline*, not its *content*.**

What makes the Lovable site feel premium is not the forest — it is the
**restraint**: one dominant element per viewport, full-bleed atmospheric
visuals, editorial whitespace, near-zero chrome. That discipline directly fixes
the four diagnosed pain points:

| Pain point | Root cause | Elevation fix (from reference discipline) |
|---|---|---|
| Generic / template-y | Dark-navy+teal glass is now the AI-agency default; no signature mood | A signature atmospheric hero + real brand visual identity |
| Too sparse / no imagery | `public/` is all Next.js boilerplate; "logo" is a CSS box | Real atmospheric/engineering imagery, full-bleed where it earns it |
| Weak hero | 6 competing stacked elements + diagram + terminal; nothing dominates | One dominant element per viewport; hero breathes |
| Feel off | Type caps at 72px; motion dumps on load; density over rhythm | Editorial type scale; choreographed motion; generous whitespace |

## 3. What STAYS (binding from DESIGN.md — no debate)

- **Single teal accent** on dominant navy (`DESIGN.md:24`). No second UI hue.
- **Fraunces (display) + Geist (body) + JetBrains Mono (numerals)** (`DESIGN.md:11,33-36`).
- **4-tier depth layering**: page bg < `.surface-recessed` < `.glass-card` < `.card-moat`.
- **WCAG 2.2 AA**: white on teal-700 CTAs (5.47:1); teal-600 never for CTA text.
- **Restraint in motion**: max 1–2 animated elements per viewport at rest;
  `prefers-reduced-motion` honored; easing `[0.16,1,0.3,1]`.
- **Verbatim copy** in `src/lib/content.ts` — no edits without owner sign-off.

## 4. What CHANGES (the v2 deltas)

### 4.1 Layout philosophy: "one dominant element per viewport"
- Hero goes from **6 stacked elements** → **3** (eyebrow → headline → CTA).
  Stat counters relocate to `StatsBand` (already duplicated there, `page.tsx:34`).
  Integration strip relocates to a thin bar under the navbar or into the footer.
- Below-the-fold sections adopt the reference's **vertical narrative rhythm**:
  each section is one idea, given a full viewport of breathing room, rather than
  packed grids. Density drops; impact rises.
- Whitespace scale increases: section padding up ~40–60%, section gaps 80–120px.

### 4.2 A signature atmospheric hero
- The hero gets a **full-bleed atmospheric visual** behind/around the copy —
  NOT a forest (wrong for engineering), but an **engineered abstraction**:
  a slow-moving data-flow field, a blueprint-grid depth render, or a moody
  architectural/systems image. The exact treatment locks against the reference's
  *mood* (atmospheric, premium, near-black) in implementation.
- The current dual `WorkflowDiagram` + `HeroROICalculator` right column is
  **consolidated into ONE signature artifact** (the diagram becomes the hero's
  atmospheric backbone; the ROI calculator moves to its own focused section).

### 4.3 Type scale push
- Display clamp max rises from `5rem` (72px) → **`clamp(3rem, 8vw, 7.5rem)`**
  (~120px) for the hero `<h1>` — matches 2026 premium hero scale and the
  reference's large-heading discipline.
- Headings get more deliberate tracking; serif/grotesque contrast tightened
  (the "classic type contrasted with modern UI" premium signal from research).
- Body line-height nudged toward 1.6–1.7 (reference runs 1.6–1.8).

### 4.4 Real brand visual identity (Phase 1)
- **Engineered SVG monogram logo** replaces the CSS "S" box (`Navbar.tsx:67`,
  `Footer.tsx:17`). Geometric, precision-machined feel — not hand-drawn illustration.
- **Favicon suite** (`favicon.ico` + `icon.svg` + Apple touch icon) replaces
  Next.js boilerplate.
- **OG/Twitter image system** (dynamic `opengraph-image.tsx` per route) —
  currently ZERO OG image exists; link previews look unprofessional.
- **Section imagery**: real **art-directed photography from Pexels** (license
  verified 2026-06-28 against official sources — free for commercial use, no
  attribution required, modification allowed). **License + curation policy:**
  - **ALLOWED categories:** moody architecture, macro machinery, cinematic
    cityscapes, data-center interiors, abstract engineering, atmospheric
    landscape, blueprint/structural detail.
  - **FORBIDDEN:** recognizable human faces (license risk: Pexels does no
    upload verification / no indemnification; "identifiable people" clause;
    PicDefense 2025 analysis flags this); visible trademarks/logos; "business
    team at laptop" clichés (these are the most-recognizable stock shots and
    read generic by definition).
  - **Treatment:** every image is color-graded to the teal-navy palette
    (dark duotone / cinematic crush) before placement, so it reads
    art-directed, not raw stock. This is the Vercel/Linear-tier technique.

### 4.5 Motion choreography (Phase 4)
- Replace the **load-dump** (6 staggered `reveal()` calls firing at once in
  `HeroSection.tsx`) with **scroll-driven reveals** — motion *unfolds* as the
  user moves, rather than dumping all at once on mount.
- Micro-interactions standardized across every interactive element.
- One signature hero motion moment (the atmospheric visual breathes/flows).

### 4.6 Depth refinement (Phase 3)
- Push the 4-tier depth contrast harder: subtle inner-glow + top-light on
  `.glass-card` so depth reads more obviously (Vercel/SetProduct blueprint-grid
  analysis). Cards must never read flat, but also never busy.

## 5. Token-level deltas (to be applied in `globals.css @theme`)

These are the *specific* changes. Final hex values lock during implementation
against the reference's verified near-black mood (`#1a1a1a`-ish base).

| Token | Current | v2 target | Rationale |
|---|---|---|---|
| Page bg base | navy-700 `#0f172a` | deepen toward `#0a0e1a`–`#0d1220` | closer to reference near-black; more "premium dark" |
| Display max | `5rem` (72px) | `7.5rem` (120px) via clamp | 2026 premium hero scale |
| Section padding (vertical) | `pt-32 pb-20` hero | `pt-40 pb-28`+ | breathing room |
| Section gap | varies | `gap-20` to `gap-32` | editorial rhythm |
| Body line-height | 1.5–1.6 | 1.6–1.7 | reference discipline |
| `.glass-card` depth | flat elevation | + inner-glow + top-light hairline | depth reads |
| Hero element count | 6 stacked | 3 | one dominant element |

## 6. Scope of pages (Phase 5 — every page, not just home)

- **Home** — hero rebuild + all 7 sections elevated to the new rhythm.
- **`/services`** — flagship 120+ catalog: filter UX, card density, micro-interactions.
- **`/ecosystems`** — 5 vertical deep-dives.
- **`/lab`** — 4-phase timeline + sandbox diagram.
- **`/contact`** — Calendly + lead-form polish.
- **`/privacy`, `/terms`** — typographic polish.
- **Special states** — `loading.tsx`, `error.tsx`, `not-found.tsx`.
- **Navbar + Footer + mobile drawer** — refined with new logo system.

## 7. Honest risks the owner should weigh

1. **Minimalism can reduce information density.** The reference shows almost no
   feature detail above the fold. sutaz.ca currently front-loads proof (stats,
   diagram, ROI calc). Going minimal means trusting the scroll. If conversion
   depends on immediate proof, we keep ONE proof element in the hero (e.g. a
   single dominant stat or the workflow diagram as the atmospheric visual), not zero.
2. **Atmospheric imagery for an engineering brand is harder than for wellness.**
   Forests read premium by default; "engineered abstractions" can read as
   generic tech-bro if not art-directed carefully. The signature visual is the
   highest-risk, highest-reward piece — it needs iteration, not a first draft.
3. **This is a layout-philosophy shift, not just polish.** Despite "elevate not
   rebrand," adopting "one element per viewport + full-bleed atmospheric hero"
   is a meaningful departure from the current dashboard density. It is still the
   same brand (palette/fonts/content/CTAs), but the *feel* changes substantially.

## 8. Verification bar (Phase 8 — non-negotiable)

- `next build --webpack` clean. `next start -p 3999` serves.
- Full Playwright + axe suite (130 tests) stays green; NEW WCAG checks added.
- Visual diff at 375/768/1280/1920 vs current live site.
- `gsd-ui-review` verification gate before merge to `main`.

---

## SIGN-OFF

Owner decision required before Phase 1 begins:

- [x] **Approved 2026-06-28** — the elevation thesis in §2 (borrow discipline, not content).
- [x] **Approved 2026-06-28** — the token deltas in §5 (deeper black, 120px display, more whitespace).
- [x] **Approved 2026-06-28** — the hero direction in §4.2 (atmospheric engineered visual,
      NOT a forest; ROI calculator relocates).
- [x] **Approved 2026-06-28** — the risk acknowledgement in §7 (minimalism trades density for mood).
- [x] **Added 2026-06-28** — imagery source = Pexels (license verified), with the
      curation + treatment policy in §4.4 (architecture/machinery/macro/cinematic only;
      no faces, no trademarks, no clichés; all images duotone-graded to palette).

Proceeding to Phase 1 (brand identity).
