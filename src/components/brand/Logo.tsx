import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * SutazLogo — "The Engineered S".
 *
 * A precision geometric monogram. Concept: the "S" is not a font character in a
 * box (the generic AI-agency default) but a custom-drawn angular glyph built from
 * 3 monoline segments on a 24×24 viewBox — evoking a drafting/CAD mark. A single
 * "trigger-node" dot sits at the terminus: semantic of an automation endpoint
 * firing. No container box; the mark owns its silhouette.
 *
 * Design notes:
 *  - Monoline stroke (2px / 24vb) → reads at 24px favicon AND 36px navbar.
 *  - Stroke-linecap round softens the angular path (premium, not harsh).
 *  - Gradient teal fill (teal-500 → teal-600) gives depth without a second hue.
 *  - The node dot is solid, slightly larger — it's the "active endpoint" focal.
 *
 * Variants:
 *  - `mark`:    the S glyph alone (favicon, avatar, square placements).
 *  - `lockup`:  mark + wordmark + mono eyebrow (navbar, footer).
 *  - inverted:  on photography/teal fills (footer dark, OG image).
 */
type LogoVariant = "mark" | "lockup";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  /** Show the mono "automation" eyebrow under the wordmark (navbar only). */
  eyebrow?: boolean;
  /** Wordmark size scale; defaults tuned per placement. */
  size?: "sm" | "md";
  /** Render as a Next link wrapping the lockup (defaults true for lockup). */
  href?: string | null;
  /** Passed through to the internal Link (e.g. to close a mobile drawer). */
  onClick?: () => void;
}

/**
 * The raw S glyph + node. Pure SVG — no external deps, renders crisp at any size.
 *
 * The glyph is a flowing cubic-bezier S (not a font character in a box) so it
 * reads unambiguously as "S" while staying geometric/engineered. A solid teal
 * "trigger-node" sits at the top-right terminus — semantic of an automation
 * endpoint firing. It's the one element that makes the mark unmistakably Sutaz.
 *
 * `filled` switches to a solid silhouette for tiny scales (favicon) where the
 * 2.5px stroke would thin out and lose legibility below ~20px.
 */
export function LogoMark({
  className,
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  if (filled) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        aria-label="Sutaz Automation"
        className={className}
      >
        <defs>
          <linearGradient id="sutaz-teal-filled" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2dd4bf" />
            <stop offset="1" stopColor="#0d9488" />
          </linearGradient>
        </defs>
        {/* Filled S silhouette — bold for favicon/avatar scale. */}
        <path
          d="M19.5 6.5 C19.5 6.5 16 3.5 11.5 3.5 C6.5 3.5 3.2 6.5 3.2 9.8 C3.2 13 6 14.5 11.5 14.5 C15 14.5 16.5 15.4 16.5 16.8 C16.5 18.4 14.2 20 11.5 20 C8 20 5.5 18.5 5.5 18.5 L4 21.5 C4 21.5 7 23 11.5 23 C17.5 23 20.8 19.8 20.8 16.3 C20.8 12.8 17.5 11.3 11.5 11.3 C8 11.3 7.5 10.4 7.5 9.5 C7.5 8.2 9.2 6.8 11.5 6.8 C14.5 6.8 16.8 8.5 16.8 8.5 Z"
          fill="url(#sutaz-teal-filled)"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="Sutaz Automation"
      className={className}
    >
      <defs>
        <linearGradient id="sutaz-teal" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      {/* Flowing S curve — engineered monoline, reads as S at any size. */}
      <path
        d="M18 6.5 C18 6.5 15 5 12 5 C9 5 6.5 6.5 6.5 9 C6.5 13 17.5 11 17.5 15 C17.5 17.5 15 19 12 19 C9 19 6 17.5 6 17.5"
        stroke="url(#sutaz-teal)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Trigger-node — the automation endpoint. Solid, focal. */}
      <circle cx="18" cy="6.5" r="2" fill="#2dd4bf" />
    </svg>
  );
}

export function SutazLogo({
  variant = "lockup",
  className,
  eyebrow = false,
  size = "md",
  href = "/",
  onClick,
}: LogoProps) {
  const markSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const wordSize = size === "sm" ? "text-sm" : "text-base";

  const inner = (
    <span className={cn("group flex items-center gap-2.5", className)}>
      <LogoMark className={cn(markSize, "transition-transform duration-300 group-hover:rotate-[-3deg]")} />
      {variant === "lockup" && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-display font-bold tracking-tight text-white", wordSize)}>
            Sutaz Automation
          </span>
          {eyebrow && (
            <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-teal-400">
              automation
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} onClick={onClick} aria-label="Sutaz Automation — home" className="inline-flex">
      {inner}
    </Link>
  );
}
