export function ProductSort({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded border px-3 py-2 text-sm">
      <option value="newest">Newest</option>
      <option value="price_asc">Price Low to High</option>
      <option value="price_desc">Price High to Low</option>
      <option value="popular">Popular</option>
    </select>
  );
}
