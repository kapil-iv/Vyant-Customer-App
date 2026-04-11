export function PaymentMethodSelector({ methods, selected, onChange }) {
  return (
    <div className="grid gap-2">
      {methods.map((m) => (
        <label key={m.code ?? m._id ?? m} className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
          <input type="radio" checked={selected === (m.code ?? m)} onChange={() => onChange(m.code ?? m)} />
          <span>{m.label ?? m.name ?? m.code ?? m}</span>
        </label>
      ))}
    </div>
  );
}
