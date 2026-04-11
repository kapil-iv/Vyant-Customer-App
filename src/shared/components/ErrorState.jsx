export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
      <p>{message}</p>
      {onRetry ? <button className="mt-2 rounded border border-rose-300 px-2 py-1" onClick={onRetry}>Retry</button> : null}
    </div>
  );
}
