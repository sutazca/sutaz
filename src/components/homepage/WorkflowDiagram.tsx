"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FileInput, Cpu, Route, BellRing } from "lucide-react";
import { EASE_OUT_EXPO as ease } from "@/lib/motion";

/**
 * WorkflowDiagram — hero supporting visual.
 * A horizontal automation pipeline (Source → Parse → Route → Notify) built from
 * glass nodes + connecting lines + an animated data-flow pulse. Pure CSS/SVG +
 * motion, no external assets. Honors prefers-reduced-motion via the global
 * CSS rule (animation-duration: 0.01ms) and the `mounted` SSR-safety gate.
 */

const NODES = [
  { icon: FileInput, label: "Source", detail: "Realtor.ca · Email · PDF", tone: "slate" as const },
  { icon: Cpu, label: "Parse", detail: "IDP · 99.8% precision", tone: "teal" as const },
  { icon: Route, label: "Route", detail: "Cost codes · Agent maps", tone: "slate" as const },
  { icon: BellRing, label: "Notify", detail: "SMS · Slack · CRM", tone: "teal" as const },
];

export function WorkflowDiagram() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="surface-recessed rounded-card p-5 md:p-6">
      <div className="flex items-center justify-between border-b border-[var(--color-border-strong)] pb-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
          sutaz.workflow.live
        </span>
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-teal-300">
            running
          </span>
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[repeat(4,1fr)] sm:gap-0">
        {NODES.map((node, i) => {
          const Icon = node.icon;
          const isLast = i === NODES.length - 1;
          return (
            <motion.div
              key={node.label}
              initial={mounted ? { opacity: 0, y: 14 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.12, ease }}
              className="relative flex items-center gap-3 sm:flex-col sm:items-stretch sm:gap-0"
            >
              {/* Node body */}
              <div className="glass-card flex flex-1 flex-col gap-2 rounded-xl p-3.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
                      (node.tone === "teal"
                        ? "bg-teal-500/15 text-teal-300 ring-1 ring-inset ring-teal-400/30"
                        : "bg-white/[0.04] text-slate-300 ring-1 ring-inset ring-white/10")
                    }
                  >
                    <Icon size={18} aria-hidden />
                  </span>
                  <span className="font-display text-sm font-semibold text-white">{node.label}</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  {node.detail}
                </p>
              </div>

              {/* Connector with animated data-flow pulse — hidden on last node */}
              {!isLast ? (
                <div className="relative flex items-center justify-center self-stretch sm:absolute sm:left-full sm:top-1/2 sm:-translate-y-1/2 sm:w-full">
                  <div className="h-px w-full bg-gradient-to-r from-teal-500/50 to-white/10 sm:h-px" />
                  <motion.span
                    aria-hidden
                    initial={mounted ? { opacity: 0 } : false}
                    animate={mounted ? { opacity: [0, 1, 0] } : {}}
                    transition={{ duration: 1.6, delay: 0.8 + i * 0.3, repeat: Infinity, ease }}
                    className="absolute h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_2px_rgb(13_148_136_/_0.6)]"
                  />
                </div>
              ) : null}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border-strong)] pt-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          avg. cycle · 120s end-to-end
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-teal-300">
          ▲ recovered: 14.4 hrs/wk
        </span>
      </div>
    </div>
  );
}
