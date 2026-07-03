import { Link, useSearchParams } from "react-router-dom";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { Pagination } from "../components/ui/Pagination";
import { PRODUCT_SORTS } from "../features/products/api";
import { useCategoriesQuery, useProductsQuery } from "../features/products/hooks";

const DEFAULT_LIMIT = 12;

function numberParam(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : "";
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? "",
    color: searchParams.get("color") ?? "",
    size: searchParams.get("size") ?? "",
    minPrice: numberParam(searchParams.get("minPrice")),
    maxPrice: numberParam(searchParams.get("maxPrice")),
    sort: searchParams.get("sort") ?? "newest",
    page: Number(searchParams.get("page") ?? 1),
    limit: DEFAULT_LIMIT
  };

  const productsQuery = useProductsQuery(filters);
  const categoriesQuery = useCategoriesQuery();

  function updateFilter(next) {
    const merged = { ...filters, ...next };
    const params = new URLSearchParams();

    if (merged.search) params.set("search", merged.search);
    if (merged.category) params.set("category", merged.category);
    if (merged.color) params.set("color", merged.color);
    if (merged.size) params.set("size", merged.size);
    if (merged.minPrice !== "") params.set("minPrice", String(merged.minPrice));
    if (merged.maxPrice !== "") params.set("maxPrice", String(merged.maxPrice));
    if (merged.sort && merged.sort !== "newest") params.set("sort", merged.sort);
    if (Number(merged.page) > 1) params.set("page", String(merged.page));

    setSearchParams(params);
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-vy-text">Product Catalog</h1>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-vy-border bg-vy-surface p-4 md:grid-cols-7">
        <input
          value={filters.search}
          onChange={(e) => updateFilter({ search: e.target.value, page: 1 })}
          placeholder="Search products"
          className="rounded-md border border-vy-border px-3 py-2 text-sm md:col-span-2"
        />

        <select
          value={filters.category}
          onChange={(e) => updateFilter({ category: e.target.value, page: 1 })}
          className="rounded-md border border-vy-border px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {(categoriesQuery.data ?? []).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select value={filters.sort} onChange={(e) => updateFilter({ sort: e.target.value, page: 1 })} className="rounded-md border border-vy-border px-3 py-2 text-sm">
          {PRODUCT_SORTS.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>

        <select value={filters.color} onChange={(e) => updateFilter({ color: e.target.value, page: 1 })} className="rounded-md border border-vy-border px-3 py-2 text-sm">
          <option value="">All Colors</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>

        <select value={filters.size} onChange={(e) => updateFilter({ size: e.target.value, page: 1 })} className="rounded-md border border-vy-border px-3 py-2 text-sm">
          <option value="">All Sizes</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>

        <div className="grid grid-cols-2 gap-2 md:col-span-1">
          <input
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={(e) => updateFilter({ minPrice: e.target.value, page: 1 })}
            placeholder="Min"
            className="rounded-md border border-vy-border px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => updateFilter({ maxPrice: e.target.value, page: 1 })}
            placeholder="Max"
            className="rounded-md border border-vy-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {productsQuery.isLoading ? <LoadingState label="Loading products..." /> : null}

      {productsQuery.isError ? <ErrorState message={productsQuery.error.message} actionLabel="Retry" onAction={() => productsQuery.refetch()} /> : null}

      {!productsQuery.isLoading && !productsQuery.isError ? (
        <>
          {(productsQuery.data?.items ?? []).length === 0 ? (
            <EmptyState title="No products found" subtitle="Try changing filters or search terms." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {productsQuery.data.items.map((product) => {
                const price = product.discountPrice ?? product.price;
                const stock = Number(product.stock ?? 0);
                return (
                  <article key={product._id} className="overflow-hidden rounded-xl border border-vy-border bg-vy-surface shadow-sm">
                    <Link to={`/products/${product._id}`}>
                      <img src={product.images?.[0] ?? ""} alt={product.name} className="h-52 w-full bg-vy-surface-muted object-cover" loading="lazy" />
                    </Link>
                    <div className="space-y-1 p-3">
                      <Link to={`/products/${product._id}`} className="line-clamp-1 text-base font-semibold text-vy-text hover:underline">
                        {product.name}
                      </Link>
                      <p className="text-sm text-vy-muted">{product.category ?? "Uncategorized"}</p>
                      <p className="text-sm text-vy-muted">Stock: {stock}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-vy-text">Rs. {price}</p>
                        {product.rating || product.averageRating ? (
                          <p className="text-xs text-amber-700">Rating: {Number(product.rating ?? product.averageRating).toFixed(1)}</p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <Pagination
            page={productsQuery.data?.pagination?.page ?? 1}
            totalPages={productsQuery.data?.pagination?.totalPages ?? 1}
            onChange={(page) => updateFilter({ page })}
          />
        </>
      ) : null}
    </section>
  );
}
