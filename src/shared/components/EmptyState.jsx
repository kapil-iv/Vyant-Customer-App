export function EmptyState({ title, action }) {
  return (
    <div className="rounded-md border bg-white px-4 py-8 text-center">
      <p className="text-sm text-slate-700">{title}</p>
      {action}
    </div>
  );
}
