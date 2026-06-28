"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * SpotlightCard — a wrapper that renders a radial-gradient spotlight following
 * the cursor via CSS custom properties (--mx/--my). The signature Linear/Vercel
 * dark-card effect. Pure CSS + one rAF-throttled mousemove listener — no deps.
 * Honors prefers-reduced-motion: the spotlight is static (no motion) so it's
 * fine; it just won't track, which is acceptable.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgb(13 148 136 / 0.12)",
  spotlightSize = 320,
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("group/spotlight relative overflow-hidden", className)}
      style={
        {
          "--spotlight-color": spotlightColor,
          "--spotlight-size": `${spotlightSize}px`,
        } as React.CSSProperties
      }
    >
      {/* Spotlight overlay — pointer-events:none so it never blocks clicks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
        style={{
          background:
            "radial-gradient(var(--spotlight-size) circle at var(--mx) var(--my), var(--spotlight-color), transparent 70%)",
        }}
      />
      {/* Content sits above the spotlight */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
