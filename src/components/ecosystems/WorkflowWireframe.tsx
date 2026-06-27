"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

/**
 * WorkflowWireframe — abstract animated representation of an automation
 * pipeline. Blueprint Section 2: "interactive, abstract 2D workflow wireframes
 * representing tools communicating smoothly."
 *
 * Props define the node labels; the connector animates a "data packet" flowing
 * left-to-right to communicate motion without stock imagery.
 */
interface WorkflowWireframeProps {
  steps: readonly string[];
  /** Stable key so the animation re-mounts when steps change. */
  id: string;
}

export function WorkflowWireframe({ steps, id }: WorkflowWireframeProps) {
  return (
    <div
      className="rounded-default border border-navy-100 bg-background-soft p-5"
      role="img"
      aria-label={`Workflow: ${steps.join(" → ")}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <div key={`${id}-${i}`} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.12 }}
              className="rounded-default border border-teal-200 bg-white px-3 py-2 text-xs font-semibold text-navy-500 shadow-sm"
            >
              {step}
            </motion.div>
            {i < steps.length - 1 ? (
              <motion.span
                key={`arrow-${id}-${i}`}
                className="text-teal-500"
                aria-hidden
                initial={{ opacity: 0.2 }}
                whileInView={{ opacity: [0.2, 1, 0.2] }}
                viewport={{ once: false }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.12 }}
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
