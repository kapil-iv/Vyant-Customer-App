import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HeroSlider } from "../features/home/components/HeroSlider";
import { ProductSkeleton } from "../features/products/components/ProductSkeleton";
import { ProductCard } from "../features/products/components/ProductCard";
import { FeaturedCarousel } from "../features/home/components/FeaturedCarousel";
import { fetchActiveTheme, fetchFeaturedProducts, fetchInfluencerHighlights, fetchSaleHighlights } from "../features/home/api";
import { fetchProducts as fetchCatalogProducts } from "../features/products/productApi";
import { EmptyState } from "../shared/components/EmptyState";
import salebanner from "./assets/salebanner.jpg";

function HomeSkeleton() {
  return (
    <div className="space-y-10 pb-16 md:space-y-12">
      <div className="h-[40vh] min-h-[300px] w-full animate-pulse rounded-[16px] bg-vy-surface-muted md:h-[70vh]" />
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-vy-surface-muted" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 w-[260px] flex-none animate-pulse rounded-[16px] bg-vy-surface-muted md:h-40 md:w-[320px]" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-vy-surface-muted" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [state, setState] = useState({
    loading: true,
    theme: null,
    featured: [],
    sales: [],
    influencerCollections: [],
    catalog: []
  });

  const categoryCards = [
    {
      key: "men",
      title: "Men's Collection",
      description: "Streetwear, formal, and everyday essentials.",
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80"
    },
    {
      key: "women",
      title: "Women's Collection",
      description: "Trending styles and exclusive designer picks.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80"
    },
    {
      key: "kids",
      title: "Kids' Collection",
      description: "Comfort-first styles and vibrant playful prints.",
      image: "https://images.unsplash.com/photo-1519238263530-99abc11ee0cd?auto=format&fit=crop&q=80"
    }
  ];

  useEffect(() => {
    let active = true;

    async function loadHome() {
      try {
        const [theme, featured, sales, influencer, catalog] = await Promise.all([
          fetchActiveTheme(),
          fetchFeaturedProducts(),
          fetchSaleHighlights(),
          fetchInfluencerHighlights(8),
          fetchCatalogProducts({})
        ]);
        if (!active) return;
        setState({
          loading: false,
          theme: theme ?? null,
          featured: featured ?? [],
          sales: sales ?? [],
          influencerCollections: influencer?.influencerCollections ?? [],
          catalog: catalog?.items ?? []
        });
      } catch {
        if (!active) return;
        setState((prev) => ({ ...prev, loading: false }));
      }
    }

    loadHome();
    return () => {
      active = false;
    };
  }, []);

  const categoryProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return state.catalog
      .filter((product) => String(product?.category ?? "").trim().toLowerCase() === selectedCategory)
      .slice(0, 8);
  }, [selectedCategory, state.catalog]);
  const filteredSales = useMemo(() => {
    if (!selectedCategory) return state.sales;

    return state.sales.filter((sale) => {
      const productMatch = Array.isArray(sale?.productIds)
        ? sale.productIds.some(
          (product) => String(product?.category ?? "").trim().toLowerCase() === selectedCategory
        )
        : false;

      if (productMatch) return true;

      const text = `${sale?.title || ""} ${sale?.saleLabel || ""} ${(sale?.terms || []).join(" ")}`.toLowerCase();
      return text.includes(selectedCategory);
    });
  }, [selectedCategory, state.sales]);
  const filteredInfluencerCollections = useMemo(() => {
    if (!selectedCategory) return state.influencerCollections;
    return state.influencerCollections.filter(
      (link) => String(link?.product?.category ?? "").trim().toLowerCase() === selectedCategory
    );
  }, [selectedCategory, state.influencerCollections]);
  const heroImage = state.theme?.assets?.heroImage || state.theme?.assets?.bannerImage || salebanner || null;
  const heroTitle = state.theme?.name || "Discover curated fashion collections.";
  const heroDescription = state.theme?.description || "Premium clothes and accessories from top collections and creators.";

  if (state.loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="space-y-10 pb-16 md:space-y-12">
      <HeroSlider theme={state.theme} fallbackImage={salebanner} />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-vy-text md:text-3xl">Shop By Category</h2>
          {selectedCategory ? (
            <button
              type="button"
              onClick={() => setSelectedCategory("")}
              className="text-sm font-semibold text-vy-muted hover:text-vy-text"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {categoryCards.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setSelectedCategory(category.key)}
              className={`group relative w-[260px] flex-none snap-center overflow-hidden rounded-[16px] border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/20 md:w-[320px] ${selectedCategory === category.key
                ? "border-indigo-500 ring-2 ring-indigo-500/20"
                : "border-vy-border hover:border-vy-border"
                }`}
            >
              <div className="absolute inset-0 h-full w-full">
                <img src={category.image} alt={category.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90" />
                {selectedCategory === category.key && <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay" />}
              </div>
              <div className="relative flex h-32 flex-col justify-end p-4 md:h-40">
                <p className="mb-1 text-xl font-extrabold tracking-tight text-white md:text-2xl">{category.title}</p>
                <p className="line-clamp-1 text-xs font-medium text-slate-200 md:text-sm">{category.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-vy-text md:text-3xl">
            {selectedCategory ? `${selectedCategory[0].toUpperCase()}${selectedCategory.slice(1)} Collection` : "New Season Essentials"}
          </h2>
          <Link to={selectedCategory ? `/products?category=${selectedCategory}` : "/products"} className="text-sm font-semibold text-vy-muted hover:text-vy-text">
            {selectedCategory ? "View all in category" : "All Products"}
          </Link>
        </div>
        {selectedCategory ? (
          categoryProducts.length ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState title={`No ${selectedCategory} products found.`} />
          )
        ) : (
          <FeaturedCarousel products={state.featured.slice(0, 10)} />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-vy-text md:text-3xl">
            {selectedCategory ? `${selectedCategory[0].toUpperCase()}${selectedCategory.slice(1)} Sales` : "Summer Sales"}
          </h2>
          <Link to="/sales" className="text-sm font-semibold text-vy-muted hover:text-vy-text">View all sales</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {filteredSales.map((sale) => (
            <Link key={sale._id} to="/sales" className="group relative overflow-hidden rounded-[16px] shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20">
              <div className="relative h-[220px] w-full bg-slate-900 md:h-[260px]">
                {sale.bannerImage ? <img src={sale.bannerImage} alt={sale.title} className="h-full w-full object-cover opacity-80 mix-blend-luminosity transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:mix-blend-normal" loading="lazy" referrerPolicy="no-referrer" /> : null}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8">
                <div className="mb-2"><span className="inline-block rounded bg-indigo-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">{sale.type || "Special Deal"}</span></div>
                <h3 className="mb-1 max-w-md text-2xl font-extrabold tracking-tight text-white md:text-3xl">{sale.title}</h3>
                <p className="mb-4 text-sm font-medium text-slate-300 md:text-base">{sale.saleLabel}</p>
                <div><span className="inline-block border-b-2 border-white pb-1 text-sm font-bold uppercase tracking-wide text-white transition-colors group-hover:border-indigo-400 group-hover:text-indigo-400">Shop Deal &rarr;</span></div>
              </div>
            </Link>
          ))}
        </div>
        {selectedCategory && !filteredSales.length ? <EmptyState title={`No ${selectedCategory} sales available.`} /> : null}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-vy-text md:text-3xl">
          {selectedCategory ? `${selectedCategory[0].toUpperCase()}${selectedCategory.slice(1)} Influencers Collection` : "Influencers Collection"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInfluencerCollections.map((link) => (
            <Link key={link._id} to={`/products/${link.product?._id}`} className="vy-card group overflow-hidden border border-vy-border bg-vy-surface transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
              <div className="relative h-56 overflow-hidden">
                <img src={link.product?.images?.[0] || ""} alt={link.title || link.product?.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                <span className="absolute left-3 top-3 rounded-full bg-teal-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {link.saleLabel || "Collection"}
                </span>
              </div>
              <div className="space-y-1 p-4">
                <h3 className="text-lg font-bold tracking-tight text-vy-text">{link.title || link.product?.name}</h3>
                <p className="text-sm text-vy-muted">{link.caption || "Curated by influencer"}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-vy-muted">By {link.influencer?.name || "Influencer"}</p>
              </div>
            </Link>
          ))}
        </div>
        {selectedCategory && !filteredInfluencerCollections.length ? (
          <EmptyState title={`No ${selectedCategory} influencer collections found.`} />
        ) : null}
      </section>
    </div>
  );
}
