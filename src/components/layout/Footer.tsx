"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/content";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/contact") return null;
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--color-border-strong)] bg-navy-800">
      <div className="container-content grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-button bg-teal-600 font-display text-sm font-bold text-white">
              S
            </span>
            <span className="font-display text-base font-bold text-white">{SITE.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Enterprise-grade workflow automation engineered for Canadian Real
            Estate, Construction, Marketing, E-Commerce, and Professional Services.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/services" className="text-slate-400 hover:text-white">Services Menu</Link></li>
            <li><Link href="/ecosystems" className="text-slate-400 hover:text-white">Vertical Ecosystems</Link></li>
            <li><Link href="/lab" className="text-slate-400 hover:text-white">The Engineering Lab</Link></li>
            <li><Link href="/contact" className="text-slate-400 hover:text-white">Book an Audit</Link></li>
          </ul>
        </nav>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><a href={`mailto:hello@${SITE.domain}`} className="text-slate-400 hover:text-white">hello@{SITE.domain}</a></li>
            <li><Link href="/privacy" className="text-slate-400 hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-slate-400 hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-border-strong)]">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-400 sm:flex-row">
          <span>© {year} {SITE.name}. All rights reserved.</span>
          <span className="font-mono">Engineered in Canada · sutaz.ca</span>
        </div>
      </div>
    </footer>
  );
}
