"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/content";
import { cn } from "@/lib/utils";
import { SutazLogo } from "@/components/brand/Logo";

/**
 * Navbar — Engineering-Luxury.
 * Glass-morphism, monospace eyebrow, animated nav underline, teal CTA with glow.
 * Sticky, condenses on scroll. Mobile: full-screen drawer.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isContactPage = pathname === "/contact";

  // Active-route check: NAV_LINKS hrefs may include a hash (e.g. "/#faq"),
  // so compare against the path portion only. (P6: was unused despite import.)
  const isLinkActive = (href: string) => {
    const path = href.split("#")[0];
    if (path === "/") return pathname === "/";
    return pathname === path;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (isContactPage) return null;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-navy-700/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        className="container-content flex h-16 items-center justify-between md:h-20"
        aria-label="Primary"
      >
        {/* Logo — Engineered S monogram + wordmark (brand/Logo.tsx) */}
        <SutazLogo
          href="/"
          variant="lockup"
          eyebrow
          size="md"
          onClick={() => setMobileOpen(false)}
        />

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative rounded-button px-4 py-2 text-sm font-medium transition-colors",
                    active ? "text-white" : "text-slate-300 hover:text-white",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-teal-400 transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="group relative inline-flex min-h-[44px] items-center gap-2 overflow-hidden rounded-button bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-600 glow-teal"
          >
            <span className="relative z-10">{SITE.ctaPrimary}</span>
            <span className="relative z-10 transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-button p-2 text-white md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 top-16 z-40 bg-navy-700/95 backdrop-blur-xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="container-content flex flex-col gap-1 py-8">
              {NAV_LINKS.map((link, i) => {
                const active = isLinkActive(link.href);
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-button px-4 py-4 font-display text-2xl font-semibold transition-colors",
                        active
                          ? "bg-teal-500/10 text-white"
                          : "text-white hover:bg-white/5",
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
              <motion.li
                className="mt-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * NAV_LINKS.length + 0.1 }}
              >
                <Link
                  href="/contact"
                  className="block rounded-button bg-teal-700 px-5 py-4 text-center font-semibold text-white glow-teal"
                  onClick={() => setMobileOpen(false)}
                >
                  {SITE.ctaPrimary}
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
