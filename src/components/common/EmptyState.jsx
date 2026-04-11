export function EmptyState({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      {actionLabel && onAction ? (
        <button type="button" className="mt-4 rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
