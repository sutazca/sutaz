"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

/**
 * WorkflowWireframe — dark "architecture diagram" aesthetic.
 * Animated data packet flowing through the pipeline.
 */
interface WorkflowWireframeProps {
  steps: readonly string[];
  id: string;
}

export function WorkflowWireframe({ steps, id }: WorkflowWireframeProps) {
  return (
    <div className="rounded-card glass-card p-6" role="img" aria-label={`Workflow: ${steps.join(" → ")}`}>
      <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
        <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
          pipeline.diagram
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <div key={`${id}-${i}`} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="rounded-lg border border-teal-500/30 bg-teal-500/5 px-3 py-2 font-mono text-xs font-semibold text-teal-100"
            >
              {step}
            </motion.div>
            {i < steps.length - 1 ? (
              <motion.span
                className="text-teal-400"
                aria-hidden
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.12 }}
              >
                <ArrowRight size={16} />
              </motion.span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
