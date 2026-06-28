"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/content";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/motion";

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-white/5 overflow-hidden rounded-card glass-card">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={i}>
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-button-${i}`}
                className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-display text-base font-semibold text-white md:text-lg">
                  {item.question}
                </span>
                <Plus
                  className={cn(
                    "shrink-0 text-teal-400 transition-transform duration-300",
                    isOpen && "rotate-45",
                  )}
                  size={20}
                  aria-hidden
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-slate-400">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
