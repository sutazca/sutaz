import Link from "next/link";
import { Button } from "@/components/ui/Button";

/**
 * 404 page — custom not-found surface (blueprint checklist #25).
 */
export default function NotFound() {
  return (
    <section className="container-content relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden py-20 text-center">
      {/* Atmospheric imagery (Phase 3 §6 special states) — graded deep-space nebula */}
      <img
        src="/sections/deep-space-graded.webp"
        alt=""
        aria-hidden
        className="section-media pointer-events-none absolute inset-0 h-full w-full"
      />
      <div className="section-scrim absolute inset-0" aria-hidden />
      <div className="relative">
        <p className="font-display text-7xl font-extrabold text-teal-600">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-white">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-3 max-w-md text-slate-300">
          The page you were looking for may have moved, or never existed. Let&apos;s
          get you back on track.
        </p>
        <div className="mt-8 flex gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="secondary">
            Schedule an audit
          </Button>
        </div>
        <Link
          href="/ecosystems"
          className="mt-6 inline-block text-sm font-medium text-teal-500 hover:text-teal-400"
        >
          Or explore our industry ecosystems →
        </Link>
      </div>
    </section>
  );
}
