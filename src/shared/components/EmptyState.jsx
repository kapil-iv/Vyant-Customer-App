export function EmptyState({ title, action }) {
  return (
    <div className="rounded-md border bg-vy-surface px-4 py-8 text-center">
      <p className="text-sm text-vy-muted">{title}</p>
      {action}
    </div>
  );
}
