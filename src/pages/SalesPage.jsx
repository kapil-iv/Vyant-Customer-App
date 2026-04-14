import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSales } from "../features/home/api";
import { Loader } from "../shared/components/Loader";
import { EmptyState } from "../shared/components/EmptyState";
import { ErrorState } from "../shared/components/ErrorState";
import { ProductCard } from "../features/products/components/ProductCard";

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function SalesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSaleId = location.state?.selectedSaleId;

  const [state, setState] = useState({ items: [], loading: true, error: "" });

  useEffect(() => {
    let mounted = true;

    async function loadSales() {
      try {
        const response = await fetchSales({ page: 1, limit: 30 });
        if (!mounted) return;
        setState({ items: response.items ?? [], loading: false, error: "" });
      } catch (error) {
        if (!mounted) return;
        setState({ items: [], loading: false, error: error.message || "Failed to load sales." });
      }
    }

    loadSales();
    return () => {
      mounted = false;
    };
  }, []);

  const orderedSales = useMemo(() => {
    if (!selectedSaleId) return state.items;
    const selected = state.items.find((sale) => sale._id === selectedSaleId);
    const rest = state.items.filter((sale) => sale._id !== selectedSaleId);
    return selected ? [selected, ...rest] : state.items;
  }, [state.items, selectedSaleId]);

  if (state.loading) {
    return <Loader label="Loading sales..." />;
  }

  if (state.error) {
    return <ErrorState message={state.error} onRetry={() => window.location.reload()} />;
  }

  if (!orderedSales.length) {
    return <EmptyState title="No active campaigns" />;
  }

  return (
    <section className="space-y-8 pb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--vy-primary)" }}>
            Campaigns
          </p>
          <h1 className="text-3xl font-black text-vy-text">All Sales</h1>
          <p className="mt-1 text-sm text-vy-muted">Weekend sale and all other running campaigns are listed below.</p>
        </div>
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--vy-secondary)" }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>

      <div className="space-y-8">
        {orderedSales.map((sale) => (
          <article key={sale._id} className="overflow-hidden rounded-2xl border border-vy-border bg-vy-surface shadow-sm">
            {sale.bannerImage ? (
              <img src={sale.bannerImage} alt={sale.title} className="h-52 w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
            ) : null}

            <div className="space-y-3 p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white" style={{ backgroundColor: "var(--vy-primary)" }}>
                  {sale.type || "campaign"}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
                  {sale.saleLabel || "Special offer"}
                </span>
              </div>

              <h2 className="text-2xl font-black text-vy-text">{sale.title}</h2>
              {sale.description ? <p className="text-sm text-vy-muted">{sale.description}</p> : null}
              <p className="text-xs font-semibold uppercase tracking-wide text-vy-muted">
                {formatDate(sale.startsAt)} to {formatDate(sale.endsAt)}
              </p>

              {Array.isArray(sale.productIds) && sale.productIds.length ? (
                <div className="grid grid-cols-2 gap-4 pt-3 md:grid-cols-4">
                  {sale.productIds.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-vy-muted">Products will be updated soon for this campaign.</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
