import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Store, ChevronRight } from "lucide-react";
import { EmptyState } from "../shared/components/EmptyState";
import { ErrorState } from "../shared/components/ErrorState";
import { fetchPublicShops } from "../features/shops/shopApi";

function ShopCardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="h-44 animate-pulse rounded-[12px] bg-vy-surface-muted" />
      ))}
    </div>
  );
}

function ShopLogo({ shop }) {
  const name = shop?.shopName || "Shop";
  const logo = shop?.logo || "";
  if (logo) {
    return <img src={logo} alt={`${name} logo`} className="h-12 w-12 rounded-xl object-cover" loading="lazy" referrerPolicy="no-referrer" />;
  }
  return (
    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--vy-primary)]/15 text-[color:var(--vy-primary)]">
      <Store size={18} />
    </div>
  );
}

export function ShopsPage() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [shops, setShops] = useState([]);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setError("");

    fetchPublicShops()
      .then((res) => {
        if (!active) return;
        setShops(res.shops || []);
        setStatus("succeeded");
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load shops");
        setStatus("failed");
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredShops = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return shops;
    return shops.filter((shop) => String(shop.shopName || "").toLowerCase().includes(q));
  }, [search, shops]);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Local Shops</h1>
          <p className="mt-1 text-sm text-vy-muted">Browse all active shops and open their product catalogs.</p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by shop name..."
          className="w-full rounded-[12px] border border-[color:var(--vy-border)] bg-vy-surface px-3 py-2 text-sm outline-none md:max-w-sm"
        />
      </div>

      {status === "loading" ? <ShopCardSkeleton /> : null}
      {status === "failed" ? <ErrorState message={error} onRetry={() => window.location.reload()} /> : null}
      {status === "succeeded" && !filteredShops.length ? <EmptyState title="No shops found." /> : null}

      {status === "succeeded" && filteredShops.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShops.map((shop) => (
            <Link
              key={shop._id}
              to={`/shops/${shop._id}`}
              className="group rounded-[12px] border border-[color:var(--vy-border)] bg-vy-surface p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ShopLogo shop={shop} />
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-vy-text">{shop.shopName}</h3>
                    <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${shop.isOpen ? "bg-emerald-100 text-emerald-700" : "bg-vy-surface-muted text-vy-muted"}`}>
                      {shop.isOpen ? "Open" : "Closed"}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-vy-muted transition group-hover:translate-x-0.5 group-hover:text-vy-muted" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-vy-muted">
                {shop.productsCount || 0} products
              </p>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}

