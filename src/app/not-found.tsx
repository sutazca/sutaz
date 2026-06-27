import Link from "next/link";
import { Button } from "@/components/ui/Button";

/**
 * 404 page — custom not-found surface (blueprint checklist #25).
 */
export default function NotFound() {
  return (
    <section className="container-content flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-extrabold text-teal-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-navy-500">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-3 max-w-md text-muted">
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
        className="mt-6 text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        Or explore our industry ecosystems →
      </Link>
    </section>
  );
}
