import Link from "next/link";
import { SITE } from "@/lib/content";

/**
 * Footer — blueprint Section 6.6. Hidden on /contact (minimal page).
 * Rendered globally; the contact page hides it via its own layout logic.
 */
export function Footer({ hidden = false }: { hidden?: boolean }) {
  if (hidden) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-600 text-background-soft/80">
      <div className="container-content grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-white">{SITE.name}</p>
          <p className="mt-2 text-sm">
            Enterprise-grade workflow automation for Canadian business.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/ecosystems" className="hover:text-white">
                Ecosystems
              </Link>
            </li>
            <li>
              <Link href="/lab" className="hover:text-white">
                The Lab
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p>
            <a href={`mailto:hello@${SITE.domain}`} className="hover:text-white">
              hello@{SITE.domain}
            </a>
          </p>
          <ul className="mt-3 space-y-1">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-500/40">
        <div className="container-content py-6 text-xs text-background-soft/60">
          © {year} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
