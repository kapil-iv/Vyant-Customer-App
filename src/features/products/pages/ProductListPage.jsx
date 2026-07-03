import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { Pagination } from "../../../shared/components/Pagination";
import { ProductCard } from "../components/ProductCard";
import { ProductFilters } from "../components/ProductFilters";
import { ProductSort } from "../components/ProductSort";
import { fetchFacets, fetchProducts } from "../api";

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-72 animate-pulse rounded-[12px] bg-vy-surface-muted" />
      ))}
    </div>
  );
}

export function ProductListPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [filters, setFilters] = useState({ q: initialSearch, category: initialCategory, materialType: "", inStock: "", minPrice: "", maxPrice: "", sort: "newest", page: 1, limit: 12 });
  const [data, setData] = useState({ items: [], page: 1, totalPages: 1 });
  const [facets, setFacets] = useState({ categories: [], materialTypes: [] });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debouncedQ = useMemo(() => filters.q, [filters.q]);

  useEffect(() => {
    const nextSearch = searchParams.get("search") || "";
    const nextCategory = searchParams.get("category") || "";

    setFilters((prev) => {
      if (prev.q === nextSearch && prev.category === nextCategory) {
        return prev;
      }
      return {
        ...prev,
        q: nextSearch,
        category: nextCategory,
        page: 1
      };
    });
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    fetchProducts({ ...filters, q: debouncedQ })
      .then((res) => {
        if (!active) return;
        setData(res);
        setStatus("succeeded");
      })
      .catch((e) => {
        if (!active) return;
        setError(e.message);
        setStatus("failed");
      });
    return () => {
      active = false;
    };
  }, [filters, debouncedQ]);

  useEffect(() => {
    fetchFacets()
      .then((f) => setFacets({ categories: f?.categories ?? [], materialTypes: f?.materialTypes ?? [] }))
      .catch(() => { });
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">All Products</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-[12px] border px-3 py-2 text-sm font-semibold md:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            Filters
          </button>
          <ProductSort value={filters.sort} onChange={(sort) => setFilters((p) => ({ ...p, sort, page: 1 }))} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:pr-2 md:self-start">
          <ProductFilters filters={filters} categories={facets.categories} materials={facets.materialTypes} onChange={(next) => setFilters((p) => ({ ...p, ...next }))} />
        </aside>

        <div className="space-y-4">
          {status === "loading" ? <ProductGridSkeleton /> : null}
          {status === "failed" ? <ErrorState message={error} onRetry={() => setFilters((p) => ({ ...p }))} /> : null}
          {status === "succeeded" && !data.items.length ? <EmptyState title="No products found" /> : null}

          {status === "succeeded" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {data.items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : null}

          <Pagination page={data.page} totalPages={data.totalPages} onChange={(page) => setFilters((p) => ({ ...p, page }))} />
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[60] bg-black/35 md:hidden">
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-vy-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button type="button" className="text-sm font-semibold" onClick={() => setMobileFiltersOpen(false)}>Close</button>
            </div>
            <ProductFilters
              filters={filters}
              categories={facets.categories}
              materials={facets.materialTypes}
              onChange={(next) => setFilters((p) => ({ ...p, ...next }))}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
