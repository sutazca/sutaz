"use client";

import { motion } from "motion/react";
import { ShieldCheck, FlaskConical, Database, Lock } from "lucide-react";

/**
 * SandboxDiagram — blueprint Section 8.3. The direct answer to the #1
 * objection (Master Blueprint Doc Section 1: "Fear of Live Data Corruption").
 *
 * Two columns: LIVE DATA (untouched) ← DEV SANDBOX (all builds tested here).
 * A directional arrow shows the one-way safety boundary: builds only reach
 * live data AFTER Phase 3 shadow runs prove safety.
 */
export function SandboxDiagram() {
  return (
    <div
      className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch"
      role="img"
      aria-label="Live data stays untouched. All builds are tested in an isolated dev sandbox, and only reach live data after Phase 3 shadow runs prove safety."
    >
      {/* LIVE DATA — untouched */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col rounded-card border-2 border-emerald-200 bg-cure-bg p-6"
      >
        <div className="flex items-center gap-2 text-cure-text">
          <ShieldCheck size={20} aria-hidden />
          <h3 className="font-display text-lg font-bold">Live Data</h3>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-cure-text">
          <li className="flex items-center gap-2">
            <Database size={16} aria-hidden /> QuickBooks
          </li>
          <li className="flex items-center gap-2">
            <Database size={16} aria-hidden /> CRM
          </li>
          <li className="flex items-center gap-2">
            <Database size={16} aria-hidden /> Slack
          </li>
        </ul>
        <p className="mt-4 inline-flex items-center gap-2 rounded-default bg-white/60 px-3 py-2 text-sm font-bold text-cure-text">
          <Lock size={16} aria-hidden /> Zero risk. Untouched.
        </p>
      </motion.div>

      {/* Directional safety boundary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col items-center justify-center gap-2 px-2 py-4 md:py-0"
      >
        <span className="rounded-full bg-navy-50 px-3 py-1 text-center text-xs font-bold text-navy-400">
          one-way
        </span>
        <span className="font-display text-2xl text-teal-600" aria-hidden>
          ←
        </span>
        <span className="max-w-[8rem] text-center text-xs text-muted">
          only after Phase 3 shadow runs
        </span>
      </motion.div>

      {/* DEV SANDBOX — isolated */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col rounded-card border-2 border-teal-200 bg-teal-50 p-6"
      >
        <div className="flex items-center gap-2 text-teal-700">
          <FlaskConical size={20} aria-hidden />
          <h3 className="font-display text-lg font-bold">Dev Sandbox</h3>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-teal-800">
          <li className="flex items-center gap-2">
            <Database size={16} aria-hidden /> Test data
          </li>
          <li className="flex items-center gap-2">
            <Database size={16} aria-hidden /> Mock APIs
          </li>
          <li className="flex items-center gap-2">
            <Database size={16} aria-hidden /> Error logging
          </li>
        </ul>
        <p className="mt-4 inline-flex items-center gap-2 rounded-default bg-white/60 px-3 py-2 text-sm font-bold text-teal-700">
          <FlaskConical size={16} aria-hidden /> All builds tested here.
        </p>
      </motion.div>
    </div>
  );
}
