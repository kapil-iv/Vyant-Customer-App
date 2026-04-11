export function LoadingState({ label = "Loading..." }) {
  return <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">{label}</div>;
}
