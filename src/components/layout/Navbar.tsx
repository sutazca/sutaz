"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Navbar — sticky on scroll with backdrop-blur transition.
 * Blueprint Section 6.1: full-width navy bg, soft-gray text links, teal CTA.
 * Mobile: slide-in drawer from right.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Compact navbar on contact page? No — the contact page renders its own
  // minimal header. This global navbar is hidden there via CSS.
  const isContactPage = pathname === "/contact";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (isContactPage) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-navy-500 text-white transition-all duration-200",
        scrolled ? "shadow-lg backdrop-blur supports-[backdrop-filter]:bg-navy-500/90" : "",
      )}
    >
      <nav
        className="container-content flex h-16 items-center justify-between md:h-18"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-white"
          onClick={() => setMobileOpen(false)}
        >
          {SITE.name}
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[15px] font-medium text-background-soft/90 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button href="/contact">{SITE.ctaPrimary}</Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-button p-2 text-white md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 bottom-0 z-40 bg-navy-500 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <ul className="container-content flex flex-col gap-2 py-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-button px-4 py-4 text-lg font-medium text-background-soft hover:bg-navy-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-4">
              <Button
                href="/contact"
                size="lg"
                className="w-full"
              >
                {SITE.ctaPrimary}
              </Button>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
