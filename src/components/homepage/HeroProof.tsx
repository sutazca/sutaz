"use client";

import { motion } from "motion/react";
import { HeroROICalculator } from "@/components/homepage/ROICalculator";
import { WorkflowDiagram } from "@/components/homepage/WorkflowDiagram";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { EASE_OUT_EXPO as ease } from "@/lib/motion";
import { useState } from "react";

/**
 * HeroProof — relocation home for the WorkflowDiagram + ROI calculator that
 * previously lived in the hero's right column.
 *
 * Per DESIGN-ELEVATION §4.1, the hero is now "one dominant element per
 * viewport" (the full-bleed orb). The proof — a live workflow diagram and a
 * self-serve ROI model — moves one scroll below, breathing in its own
 * viewport. Neither child component is modified: this is a pure relocation
 * wrapper so the homepage keeps its conversion proof while the hero becomes
 * the signature artifact.
 *
 * This is a client component because both children are client ("use client")
 * and use motion. No DB / no server state.
 */
export function HeroProof() {
  const [mounted, setMounted] = useState(false);

  const reveal = (delay = 0) => ({
    initial: mounted ? { opacity: 0, y: 24 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease },
  });

  return (
    <section className="section-pad relative">
      <div className="container-content">
        <SectionHeading
          align="center"
          eyebrow="See the engine"
          title="Model your return in real time"
          subtitle="A live workflow and a self-serve ROI model. Drag the inputs and watch the recovered capital compound."
        />

        <motion.div
          {...reveal(0.1)}
          className="mx-auto mt-16 grid max-w-5xl items-start gap-5 lg:grid-cols-[1fr_1fr]"
        >
          {/* Z-space separation: diagram and calculator drift at contrasting
              speeds so the pair reads as layered depth while scrolling. */}
          <ParallaxLayer speed={-0.1}>
            <WorkflowDiagram />
          </ParallaxLayer>
          <ParallaxLayer speed={0.06}>
            <HeroROICalculator />
          </ParallaxLayer>
        </motion.div>
      </div>
    </section>
  );
}
