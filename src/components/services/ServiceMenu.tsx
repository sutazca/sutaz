"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star } from "lucide-react";
import {
  VERTICALS,
  ALL_CATEGORIES,
  ALL_COMPLEXITY,
  ALL_TYPES,
  CATEGORY_COLORS,
  type Service,
  type ServiceCategory,
  type Complexity,
  type EngagementType,
} from "@/lib/service-catalog";
import { cn } from "@/lib/utils";

/**
 * ServiceMenu — the flagship interactive catalog.
 * Restyle (P5): cards use the recessed surface so each is clearly delimited;
 * Engineering Moat services get .card-moat + a prominent star badge so the
 * differentiator reads at a glance; type hierarchy bumped for AA contrast;
 * FilterChip switched from inline-hex style to Tailwind + tokens.
 *
 * NOTE: COMPLEXITY_META is intentionally not imported — it carries description
 * copy that isn't surfaced in this view (kept in the catalog for future use).
 */

const COMPLEXITY_STYLE: Record<Complexity, string> = {
  Quick: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  Mid: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
  Complex: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  Enterprise: "bg-red-500/15 text-red-300 ring-red-500/30",
};
const TYPE_STYLE: Record<EngagementType, string> = {
  Build: "bg-white/10 text-white ring-white/20",
  Retainer: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  Both: "bg-indigo-500/15 text-indigo-300 ring-indigo-500/30",
};

function ServiceCard({ service }: { service: Service }) {
  const catColor = CATEGORY_COLORS[service.category];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-5 transition-colors",
        "border-[var(--color-border-strong)]",
        service.moat ? "surface-recessed card-moat" : "surface-recessed hover:border-teal-400/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-display text-base font-bold leading-snug text-white">
          {service.name}
        </p>
        {service.moat ? (
          <span
            className="flex shrink-0 items-center gap-1 rounded-full bg-teal-500/15 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-teal-300 ring-1 ring-inset ring-teal-400/40"
            title="Engineering Moat — no-code agencies cannot build this"
          >
            <Star size={11} className="fill-teal-300" aria-hidden />
            Moat
          </span>
        ) : null}
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{service.problem}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 border-t border-[var(--color-border-strong)] pt-3">
        <span
          className="rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset"
          style={{ background: catColor + "20", color: catColor, borderColor: catColor + "40" }}
        >
          {service.category}
        </span>
        <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", COMPLEXITY_STYLE[service.complexity])}>
          {service.complexity}
        </span>
        <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", TYPE_STYLE[service.type])}>
          {service.type}
        </span>
      </div>
    </motion.div>
  );
}

export function ServiceMenu() {
  const [activeVertical, setActiveVertical] = useState(VERTICALS[0].id);
  const [filters, setFilters] = useState<{
    categories: ServiceCategory[];
    complexities: Complexity[];
    types: EngagementType[];
    moatOnly: boolean;
  }>({ categories: [], complexities: [], types: [], moatOnly: false });

  const vertical = VERTICALS.find((v) => v.id === activeVertical)!;

  const filtered = useMemo(() => {
    let s = vertical.services;
    if (filters.moatOnly) s = s.filter((x) => x.moat);
    if (filters.categories.length) s = s.filter((x) => filters.categories.includes(x.category));
    if (filters.complexities.length) s = s.filter((x) => filters.complexities.includes(x.complexity));
    if (filters.types.length) s = s.filter((x) => filters.types.includes(x.type));
    return s;
  }, [vertical, filters]);

  const toggleCategory = (val: ServiceCategory) =>
    setFilters((f) => ({ ...f, categories: f.categories.includes(val) ? f.categories.filter((x) => x !== val) : [...f.categories, val] }));
  const toggleComplexity = (val: Complexity) =>
    setFilters((f) => ({ ...f, complexities: f.complexities.includes(val) ? f.complexities.filter((x) => x !== val) : [...f.complexities, val] }));
  const toggleType = (val: EngagementType) =>
    setFilters((f) => ({ ...f, types: f.types.includes(val) ? f.types.filter((x) => x !== val) : [...f.types, val] }));
  const clearFilters = () =>
    setFilters({ categories: [], complexities: [], types: [], moatOnly: false });
  const hasFilters =
    filters.categories.length || filters.complexities.length || filters.types.length || filters.moatOnly;

  const grouped = ALL_CATEGORIES.reduce<Record<string, Service[]>>((acc, cat) => {
    const items = filtered.filter((s) => s.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div>
      {/* Vertical tabs */}
      <div className="overflow-x-auto border-b border-[var(--color-border-strong)]">
        <div className="flex min-w-max gap-1">
          {VERTICALS.map((v) => (
            <button
              key={v.id}
              id={v.id}
              onClick={() => { setActiveVertical(v.id); clearFilters(); }}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-bold transition-colors",
                activeVertical === v.id
                  ? "border-teal-400 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200",
              )}
            >
              <span>{v.emoji}</span>
              <span>{v.name}</span>
              <span className={cn(
                "rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold",
                v.phase === 1 ? "bg-emerald-500/15 text-emerald-300" : "bg-blue-500/15 text-blue-300",
              )}>
                P{v.phase}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Vertical summary band */}
      <div className="mt-6 rounded-card glass-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{vertical.emoji}</span>
              <h2 className="font-display text-lg font-bold text-white">{vertical.name}</h2>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              <span className="font-bold text-white">{vertical.services.length}</span> services ·{" "}
              <span className="font-bold text-teal-400">
                {vertical.services.filter((s) => s.moat).length}
              </span>{" "}
              Engineering Moat
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const count = vertical.services.filter((s) => s.category === cat).length;
              if (!count) return null;
              return (
                <span
                  key={cat}
                  className="rounded-full px-2.5 py-1 font-mono text-xs font-semibold ring-1 ring-inset"
                  style={{ background: CATEGORY_COLORS[cat] + "15", color: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] + "30" }}
                >
                  {cat}: {count}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-5 rounded-card glass-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Filter</p>
          {hasFilters ? (
            <button onClick={clearFilters} className="text-xs text-slate-400 underline hover:text-slate-200">
              Clear · {filtered.length}/{vertical.services.length}
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-4">
          <FilterGroup label="Category">
            {ALL_CATEGORIES.map((cat) => (
              <FilterChip key={cat} active={filters.categories.includes(cat)} color={CATEGORY_COLORS[cat]} onClick={() => toggleCategory(cat)}>
                {cat}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="Complexity">
            {ALL_COMPLEXITY.map((c) => (
              <FilterChip key={c} active={filters.complexities.includes(c)} onClick={() => toggleComplexity(c)}>
                {c}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="Type">
            {ALL_TYPES.map((t) => (
              <FilterChip key={t} active={filters.types.includes(t)} onClick={() => toggleType(t)}>
                {t}
              </FilterChip>
            ))}
          </FilterGroup>
          <button
            onClick={() => setFilters((f) => ({ ...f, moatOnly: !f.moatOnly }))}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold transition-all",
              filters.moatOnly
                ? "border-teal-400 bg-teal-500/20 text-teal-200"
                : "border-[var(--color-border-strong)] bg-white/[0.03] text-slate-300 hover:border-teal-400/50",
            )}
          >
            <Star size={11} className={filters.moatOnly ? "fill-teal-300 text-teal-300" : ""} aria-hidden />
            Moat Only
          </button>
        </div>
      </div>

      {/* Result count + Service grid (grouped by category) */}
      <AnimatePresence mode="wait">
        <motion.div key={activeVertical + JSON.stringify(filters)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-8 space-y-8">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Showing {filtered.length} of {vertical.services.length} services
          </p>
          {Object.keys(grouped).length === 0 ? (
            <p className="py-12 text-center text-slate-400">No services match the current filters.</p>
          ) : (
            Object.entries(grouped).map(([cat, services]) => (
              <div key={cat}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORY_COLORS[cat as ServiceCategory] }} />
                  <p className="font-mono text-xs uppercase tracking-widest text-slate-300">{cat}</p>
                  <span className="font-mono text-xs text-slate-500">({services.length})</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((s) => <ServiceCard key={s.name} service={s} />)}
                </div>
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="pr-1 font-mono text-xs text-slate-400">{label}:</span>
      {children}
    </div>
  );
}

function FilterChip({
  active, onClick, color, children,
}: { active: boolean; onClick: () => void; color?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "min-h-[28px] rounded-full border px-2.5 py-1 text-xs font-semibold transition-all",
        active
          ? "border-teal-400 bg-teal-500/20 text-teal-100"
          : "border-[var(--color-border-strong)] bg-white/[0.03] text-slate-300 hover:border-teal-400/50 hover:text-white",
      )}
      style={active && color ? { background: color + "30", color: "#fff", borderColor: color } : undefined}
    >
      {children}
    </button>
  );
}
