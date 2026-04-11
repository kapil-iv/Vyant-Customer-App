export function ProductSkeleton() {
  return (
    <article className="vy-card overflow-hidden border border-slate-200 bg-white">
      <div className="relative aspect-[4/5] w-full animate-pulse bg-slate-200" />
      <div className="space-y-3 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="flex gap-2 pt-1">
          <div className="h-9 flex-1 animate-pulse rounded-[12px] bg-slate-200" />
          <div className="h-9 w-11 animate-pulse rounded-[12px] bg-slate-200" />
        </div>
      </div>
    </article>
  );
}
