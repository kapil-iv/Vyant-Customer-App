export function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded border px-2 py-1 text-sm disabled:opacity-40">Prev</button>
      <span className="text-sm">{page} / {totalPages}</span>
      <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="rounded border px-2 py-1 text-sm disabled:opacity-40">Next</button>
    </div>
  );
}
