import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { fetchInfluencerHighlights } from "../features/home/api";

export function InfluencerPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setError("");
        const data = await fetchInfluencerHighlights(24);
        if (!mounted) return;
        setCollections(data?.influencerCollections || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load influencer collections.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-[color:var(--vy-border)] bg-[color:var(--vy-surface)] p-5">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--vy-muted)]">
          <Sparkles size={14} />
          Influencer Picks
        </p>
        <h1 className="mt-2 text-2xl font-black">Curated Collections</h1>
        <p className="mt-1 text-sm text-[color:var(--vy-muted)]">
          Shop creator-led recommendations across local stores.
        </p>
      </header>

      {loading ? <p className="text-sm text-[color:var(--vy-muted)]">Loading influencer collections...</p> : null}
      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
      ) : null}

      {!loading && collections.length === 0 ? (
        <div className="rounded-2xl border border-[color:var(--vy-border)] bg-[color:var(--vy-surface)] p-6 text-sm text-[color:var(--vy-muted)]">
          No influencer collections available right now.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((item) => (
          <article
            key={item._id}
            className="overflow-hidden rounded-2xl border border-[color:var(--vy-border)] bg-[color:var(--vy-surface)] shadow-sm"
          >
            <img
              src={item.product?.images?.[0] || "https://dummyimage.com/600x400/e7dcc9/7d5f43&text=Vyant"}
              alt={item.title || "Collection"}
              className="h-44 w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--vy-muted)]">
                {item.influencer?.name || "Influencer"}
              </p>
              <h2 className="line-clamp-2 text-base font-bold">{item.title || "Influencer Collection"}</h2>
              <p className="line-clamp-2 text-sm text-[color:var(--vy-muted)]">{item.caption || "Curated product recommendation."}</p>
              {item.product?._id ? (
                <Link
                  to={`/products/${item.product._id}`}
                  className="inline-flex rounded-full px-4 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: "var(--vy-primary)" }}
                >
                  View Product
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
