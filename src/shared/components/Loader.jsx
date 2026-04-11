export function Loader({ label = "Loading..." }) {
  return (
    <div className="space-y-3 rounded-[12px] border bg-white p-4 shadow-xl shadow-slate-200/50">
      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
