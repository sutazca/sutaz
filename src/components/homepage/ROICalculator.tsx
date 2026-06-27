"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { TrendingDown, ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { calculateROI } from "@/lib/roi";
import { formatCAD } from "@/lib/utils";
import { ROI_BOUNDS } from "@/types/roi";

/**
 * ROICalculator — blueprint Section 10.
 * Three sliders (team size, avg salary, hrs lost/week) drive a live
 * "Annual Capital Leak" + "With Automation" recovery panel.
 *
 * The 80% recovery rate is a labeled assumption (see src/lib/roi.ts).
 */
export function HeroROICalculator() {
  // Explicit number type — ROI_BOUNDS is `as const`, so the defaults are
  // literal types (10, 55000, 10) which would otherwise narrow useState.
  const [teamSize, setTeamSize] = useState<number>(ROI_BOUNDS.teamSize.default);
  const [averageSalary, setAverageSalary] = useState<number>(
    ROI_BOUNDS.averageSalary.default,
  );
  const [hoursLostPerWeek, setHoursLostPerWeek] = useState<number>(
    ROI_BOUNDS.hoursLostPerWeek.default,
  );

  const result = useMemo(
    () => calculateROI({ teamSize, averageSalary, hoursLostPerWeek }),
    [teamSize, averageSalary, hoursLostPerWeek],
  );

  return (
    <div
      className="rounded-card border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)] md:p-8"
      data-testid="roi-calculator"
    >
      <h2 className="font-display text-sm font-bold uppercase tracking-widest text-teal-600">
        Your Annual Capital Leak
      </h2>

      <div className="mt-2 flex items-baseline gap-2">
        <AnimatedCounter
          value={result.annualWaste}
          format={formatCAD}
          className="font-display text-4xl font-extrabold text-pain-text md:text-5xl"
        />
        <TrendingDown className="text-pain-text" size={28} aria-hidden />
      </div>
      <p className="mt-2 text-sm text-muted">
        That&apos;s what manual data entry costs you every year.
      </p>

      <hr className="my-6 border-navy-100" aria-hidden />

      <div className="space-y-6">
        <Slider
          label="Team Size"
          value={teamSize}
          min={ROI_BOUNDS.teamSize.min}
          max={ROI_BOUNDS.teamSize.max}
          step={ROI_BOUNDS.teamSize.step}
          onChange={setTeamSize}
        />
        <Slider
          label="Avg Salary (CAD)"
          value={averageSalary}
          min={ROI_BOUNDS.averageSalary.min}
          max={ROI_BOUNDS.averageSalary.max}
          step={ROI_BOUNDS.averageSalary.step}
          formatValue={formatCAD}
          onChange={setAverageSalary}
        />
        <Slider
          label="Hrs Lost / Week"
          value={hoursLostPerWeek}
          min={ROI_BOUNDS.hoursLostPerWeek.min}
          max={ROI_BOUNDS.hoursLostPerWeek.max}
          step={ROI_BOUNDS.hoursLostPerWeek.step}
          onChange={setHoursLostPerWeek}
        />
      </div>

      <hr className="my-6 border-navy-100" aria-hidden />

      <div className="rounded-default bg-background-soft p-5">
        <h3 className="font-display text-sm font-bold uppercase tracking-widest text-teal-600">
          With Automation
        </h3>

        <dl className="mt-4 space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm font-medium text-muted">Net Year 1 Recovery</dt>
            <motion.dd
              key={result.netRecoveryYear1}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="font-display text-xl font-bold text-cure-text tabular-nums"
            >
              {formatCAD(result.netRecoveryYear1)}
            </motion.dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm font-medium text-muted">ROI</dt>
            <dd className="font-display text-xl font-bold text-navy-500 tabular-nums">
              {result.roiPercentage.toLocaleString("en-CA")}%
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm font-medium text-muted">Payback</dt>
            <dd className="font-display text-xl font-bold text-navy-500 tabular-nums">
              {result.paybackWeeks.toLocaleString("en-CA")} weeks
            </dd>
          </div>
        </dl>
      </div>

      <Button href="/contact" size="lg" className="mt-6 w-full">
        Schedule Your Free Audit
        <ArrowRight size={18} aria-hidden />
      </Button>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Estimates use mid-range build fees and assume automation recovers 80%
        of wasted time. Figures are illustrative; your audit gives exact numbers.
      </p>
    </div>
  );
}
