import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Globe, MapPin, Store } from "lucide-react";
import { ProductCard } from "../features/products/components/ProductCard";
import { EmptyState } from "../shared/components/EmptyState";
import { ErrorState } from "../shared/components/ErrorState";
import { fetchPublicShops } from "../features/shops/shopApi";

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-72 animate-pulse rounded-[12px] bg-slate-200" />
      ))}
    </div>
  );
}

function formatAddress(shop) {
  if (!shop) return "Address not available yet.";
  if (typeof shop.address === "string" && shop.address.trim()) return shop.address;
  if (shop.address && typeof shop.address === "object") {
    const parts = [
      shop.address.line1,
      shop.address.line2,
      shop.address.city,
      shop.address.state,
      shop.address.pincode
    ].filter(Boolean);
    if (parts.length) return parts.join(", ");
  }
  return "Address not available yet.";
}

function getSocialLinks(shop) {
  const links = shop?.socialLinks;
  if (!links || typeof links !== "object") return [];

  return Object.entries(links)
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      href: value
    }));
}

function ShopLogo({ shop }) {
  const name = shop?.shopName || "Shop";
  if (shop?.logo) {
    return <img src={shop.logo} alt={`${name} logo`} className="h-16 w-16 rounded-2xl object-cover" loading="lazy" referrerPolicy="no-referrer" />;
  }

  return (
    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--vy-primary)]/15 text-[color:var(--vy-primary)]">
      <Store size={24} />
    </div>
  );
}

export function ShopDetailPage() {
  const { shopId } = useParams();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setError("");

    fetchPublicShops()
      .then((res) => {
        if (!active) return;
        const matchedShop = (res.shops || []).find((item) => String(item._id) === String(shopId)) || null;
        const matchedProducts = (res.products || []).filter((item) => String(item?.shop?._id) === String(shopId));

        if (!matchedShop) {
          setError("Shop not found.");
          setStatus("failed");
          return;
        }

        setShop(matchedShop);
        setProducts(matchedProducts);
        setStatus("succeeded");
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load shop details");
        setStatus("failed");
      });

    return () => {
      active = false;
    };
  }, [shopId]);

  const socialLinks = useMemo(() => getSocialLinks(shop), [shop]);

  return (
    <section className="space-y-6">
      <div className="rounded-[12px] border border-[color:var(--vy-border)] bg-white p-5 md:p-6">
        {status === "loading" ? (
          <div className="h-28 animate-pulse rounded-[12px] bg-slate-200" />
        ) : null}

        {status === "failed" ? <ErrorState message={error} /> : null}

        {status === "succeeded" && shop ? (
          <div className="space-y-4">
            <Link to="/shops" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Back to shops
            </Link>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <ShopLogo shop={shop} />
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight">{shop.shopName}</h1>
                  <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${shop.isOpen ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                    {shop.isOpen ? "Open" : "Closed"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>{formatAddress(shop)}</span>
                </p>
                {socialLinks.length ? (
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-[color:var(--vy-border)] px-3 py-1 text-xs font-semibold hover:bg-slate-50"
                      >
                        <Globe size={13} />
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Social links not available yet.</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-extrabold tracking-tight">Products from this shop</h2>
        {status === "loading" ? <ProductGridSkeleton /> : null}
        {status === "succeeded" && !products.length ? <EmptyState title="No active products found for this shop." /> : null}
        {status === "succeeded" && products.length ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

