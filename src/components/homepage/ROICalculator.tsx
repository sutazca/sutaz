"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { TrendingDown, ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/Slider";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { calculateROI } from "@/lib/roi";
import { formatCAD } from "@/lib/utils";
import { ROI_BOUNDS } from "@/types/roi";

/**
 * ROICalculator — Engineering-Luxury "terminal" panel.
 * Dark glass card, JetBrains Mono numerals, live calc, animated counter.
 * The 80% recovery rate is a labeled assumption (see src/lib/roi.ts).
 */
export function HeroROICalculator() {
  const [teamSize, setTeamSize] = useState<number>(ROI_BOUNDS.teamSize.default);
  const [averageSalary, setAverageSalary] = useState<number>(ROI_BOUNDS.averageSalary.default);
  const [hoursLostPerWeek, setHoursLostPerWeek] = useState<number>(ROI_BOUNDS.hoursLostPerWeek.default);

  const result = useMemo(
    () => calculateROI({ teamSize, averageSalary, hoursLostPerWeek }),
    [teamSize, averageSalary, hoursLostPerWeek],
  );

  return (
    <div className="glass-card rounded-card p-6 md:p-8 shadow-[var(--shadow-card)]">
      {/* Terminal-style header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">
            capital-leak.terminal
          </span>
        </div>
      </div>

      <h2 className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-teal-400">
        Your Annual Capital Leak
      </h2>

      <div className="mt-2 flex items-baseline gap-2">
        <AnimatedCounter
          value={result.annualWaste}
          format={formatCAD}
          className="font-mono text-4xl font-bold text-red-300 md:text-5xl tabular-nums"
        />
        <TrendingDown className="text-red-400/70" size={28} aria-hidden />
      </div>
      <p className="mt-2 text-sm text-slate-500">
        Manual data entry is costing you this — every year.
      </p>

      <div className="my-6 hairline" />

      <div className="space-y-6">
        <Slider label="Team Size" value={teamSize} min={ROI_BOUNDS.teamSize.min} max={ROI_BOUNDS.teamSize.max} step={ROI_BOUNDS.teamSize.step} onChange={setTeamSize} />
        <Slider label="Avg Salary (CAD)" value={averageSalary} min={ROI_BOUNDS.averageSalary.min} max={ROI_BOUNDS.averageSalary.max} step={ROI_BOUNDS.averageSalary.step} formatValue={formatCAD} onChange={setAverageSalary} />
        <Slider label="Hrs Lost / Week" value={hoursLostPerWeek} min={ROI_BOUNDS.hoursLostPerWeek.min} max={ROI_BOUNDS.hoursLostPerWeek.max} step={ROI_BOUNDS.hoursLostPerWeek.step} onChange={setHoursLostPerWeek} />
      </div>

      <div className="my-6 hairline" />

      <div className="rounded-button bg-white/[0.03] p-5 ring-1 ring-inset ring-white/10">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-teal-400">
          With Automation
        </h3>
        <dl className="mt-4 space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-slate-400">Net Year 1 Recovery</dt>
            <motion.dd key={result.netRecoveryYear1} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="font-mono text-xl font-bold text-emerald-300 tabular-nums">
              {formatCAD(result.netRecoveryYear1)}
            </motion.dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-slate-400">ROI</dt>
            <dd className="font-mono text-xl font-bold text-white tabular-nums">
              {result.roiPercentage.toLocaleString("en-CA")}%
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-slate-400">Payback</dt>
            <dd className="font-mono text-xl font-bold text-white tabular-nums">
              {result.paybackWeeks.toLocaleString("en-CA")} wks
            </dd>
          </div>
        </dl>
      </div>

      <a
        href="/contact"
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-button bg-teal-600 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-teal-500 glow-teal"
      >
        Schedule Your Free Audit
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </a>

      <p className="mt-4 text-xs leading-relaxed text-slate-600">
        Estimates use mid-range build fees and assume automation recovers 80% of
        wasted time. Figures are illustrative; your audit gives exact numbers.
      </p>
    </div>
  );
}
