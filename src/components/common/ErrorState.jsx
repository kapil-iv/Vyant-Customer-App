export function ErrorState({ message = "Something went wrong.", actionLabel, onAction }) {
  return (
    <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-800">
      <p>{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="rounded-md border border-rose-300 px-3 py-1 hover:bg-rose-100" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
