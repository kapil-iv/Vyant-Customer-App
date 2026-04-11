import { useState } from "react";

export function AddressForm({ initialValue, onSubmit, submitting }) {
  const [form, setForm] = useState(
    initialValue ?? { fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", landmark: "", isDefault: false }
  );

  return (
    <form
      className="grid grid-cols-1 gap-2 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <input required placeholder="Full name" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} className="rounded border px-3 py-2 text-sm" />
      <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="rounded border px-3 py-2 text-sm" />
      <input required placeholder="Line 1" value={form.line1} onChange={(e) => setForm((p) => ({ ...p, line1: e.target.value }))} className="rounded border px-3 py-2 text-sm md:col-span-2" />
      <input placeholder="Line 2" value={form.line2} onChange={(e) => setForm((p) => ({ ...p, line2: e.target.value }))} className="rounded border px-3 py-2 text-sm md:col-span-2" />
      <input required placeholder="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} className="rounded border px-3 py-2 text-sm" />
      <input required placeholder="State" value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} className="rounded border px-3 py-2 text-sm" />
      <input required placeholder="Pincode" value={form.pincode} onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))} className="rounded border px-3 py-2 text-sm" />
      <input placeholder="Landmark" value={form.landmark} onChange={(e) => setForm((p) => ({ ...p, landmark: e.target.value }))} className="rounded border px-3 py-2 text-sm" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))} /> Set default</label>
      <button type="submit" disabled={submitting} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">{submitting ? "Saving..." : "Save Address"}</button>
    </form>
  );
}
