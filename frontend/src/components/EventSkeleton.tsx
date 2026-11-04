export function EventCardSkeleton() {
  return (
    <div className="card h-full overflow-hidden border border-base-300 bg-base-100">
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="card-body gap-3">
        <div className="skeleton h-6 w-4/5" />
        <div className="skeleton h-4 w-3/5" />
        <div className="skeleton h-4 w-2/5" />
        <div className="skeleton mt-4 h-10 w-full" />
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}
