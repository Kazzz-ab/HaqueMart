function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className ?? ""}`} />;
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* Hero */}
      <Skeleton className="mb-12 h-48 rounded-2xl" />

      {/* Category pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border">
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="flex flex-col gap-3 p-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-3/4" />
              <div className="mt-auto flex items-center justify-between">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
