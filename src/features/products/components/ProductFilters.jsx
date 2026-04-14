export function ProductFilters({ filters, categories, materials, onChange, className = "" }) {
  return (
    <div className={`space-y-3 rounded-[12px] border bg-vy-surface p-3 shadow-xl shadow-slate-200/50 ${className}`}>
      <input
        value={filters.q}
        onChange={(e) => onChange({ q: e.target.value, page: 1 })}
        placeholder="Search"
        className="w-full rounded-[12px] border px-3 py-2 text-sm"
      />
      <select value={filters.category} onChange={(e) => onChange({ category: e.target.value, page: 1 })} className="w-full rounded-[12px] border px-3 py-2 text-sm">
        <option value="">Category</option>
        {(categories || []).map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={filters.materialType} onChange={(e) => onChange({ materialType: e.target.value, page: 1 })} className="w-full rounded-[12px] border px-3 py-2 text-sm">
        <option value="">Material</option>
        {(materials || []).map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={filters.inStock} onChange={(e) => onChange({ inStock: e.target.value, page: 1 })} className="w-full rounded-[12px] border px-3 py-2 text-sm">
        <option value="">Stock</option>
        <option value="true">In Stock</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input value={filters.minPrice} onChange={(e) => onChange({ minPrice: e.target.value, page: 1 })} placeholder="Min" className="rounded-[12px] border px-3 py-2 text-sm" />
        <input value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: e.target.value, page: 1 })} placeholder="Max" className="rounded-[12px] border px-3 py-2 text-sm" />
      </div>
    </div>
  );
}
