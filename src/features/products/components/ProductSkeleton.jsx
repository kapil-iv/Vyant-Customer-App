export function ProductSkeleton() {
  return (
    <article className="vy-card overflow-hidden border border-vy-border bg-vy-surface">
      <div className="relative aspect-[4/5] w-full animate-pulse bg-vy-surface-muted" />
      <div className="space-y-3 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-vy-surface-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-vy-surface-muted" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-vy-surface-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-vy-surface-muted" />
        <div className="flex gap-2 pt-1">
          <div className="h-9 flex-1 animate-pulse rounded-[12px] bg-vy-surface-muted" />
          <div className="h-9 w-11 animate-pulse rounded-[12px] bg-vy-surface-muted" />
        </div>
      </div>
    </article>
  );
}
