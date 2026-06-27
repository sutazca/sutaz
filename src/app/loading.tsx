/**
 * Root loading.tsx — skeleton shown while route segments resolve.
 */
export default function Loading() {
  return (
    <div className="container-content py-24" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-8 w-1/3 animate-pulse rounded-default bg-navy-100" />
        <div className="h-4 w-full animate-pulse rounded-default bg-navy-100" />
        <div className="h-4 w-5/6 animate-pulse rounded-default bg-navy-100" />
        <div className="h-4 w-2/3 animate-pulse rounded-default bg-navy-100" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
