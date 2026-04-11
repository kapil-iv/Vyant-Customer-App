import { useState } from "react";

export function ReturnOrderForm({ onSubmit, submitting }) {
  const [reason, setReason] = useState("");

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ reason: reason.trim() || undefined });
      }}
    >
      <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full rounded border px-3 py-2 text-sm" placeholder="Reason (optional)" />
      <button type="submit" disabled={submitting} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">{submitting ? "Submitting..." : "Request Return"}</button>
    </form>
  );
}
