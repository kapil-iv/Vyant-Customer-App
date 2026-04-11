export function QuantityStepper({ value, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onDecrease} className="h-8 w-8 rounded border">-</button>
      <span className="min-w-6 text-center text-sm">{value}</span>
      <button type="button" onClick={onIncrease} className="h-8 w-8 rounded border">+</button>
    </div>
  );
}
