"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { LAB_PHASES } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * PhaseTimeline — blueprint Section 8.2. 4-phase horizontal timeline; clicking
 * a phase expands its verbatim description + deliverables below.
 * The verbatim phase descriptions live in src/lib/content.ts (LAB_PHASES).
 */
export function PhaseTimeline() {
  const [active, setActive] = useState(0);
  const phase = LAB_PHASES[active];

  return (
    <div>
      {/* Timeline rail */}
      <ol className="relative grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-0">
        {/* connecting line (desktop) */}
        <div
          className="absolute left-0 right-0 top-4 hidden h-0.5 bg-navy-100 md:block"
          aria-hidden
        />
        {LAB_PHASES.map((p, i) => {
          const isActive = i === active;
          return (
            <li key={p.number} className="relative z-10">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                aria-label={`Phase ${p.number}: ${p.title}, ${p.window}`}
                className={cn(
                  "flex w-full cursor-pointer flex-col items-center gap-2 bg-transparent px-2 text-center transition-colors md:flex-row md:gap-3 md:text-left",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold transition-colors",
                    isActive
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-navy-200 bg-white text-navy-400",
                  )}
                >
                  {p.number}
                </span>
                <span>
                  <span
                    className={cn(
                      "block font-display text-sm font-bold",
                      isActive ? "text-teal-600" : "text-navy-500",
                    )}
                  >
                    Phase {p.number}
                  </span>
                  <span className="block text-xs text-muted">{p.window}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Expanded detail */}
      <div className="mt-8 rounded-card border border-navy-100 bg-background-soft p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 font-display font-bold text-white">
                {phase.number}
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-navy-500">
                  {phase.title}
                </h3>
                <p className="text-sm font-semibold text-teal-600">
                  {phase.window}
                </p>
              </div>
            </div>
            {/* VERBATIM description from Master Blueprint Doc Section 3 */}
            <p className="mt-4 text-lg leading-relaxed text-navy-400">
              {phase.description}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cure-text">
              <ShieldCheck size={18} aria-hidden />
              Zero-risk guarantee: live channels untouched this phase.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
