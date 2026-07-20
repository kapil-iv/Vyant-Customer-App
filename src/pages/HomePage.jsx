import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS } from "../graphql/queries";
import { HeroSlider } from "../features/home/components/HeroSlider";
import { ProductSkeleton } from "../features/products/components/ProductSkeleton";
import { ProductCard } from "../features/products/components/ProductCard";
import { FeaturedCarousel } from "../features/home/components/FeaturedCarousel";
import { fetchActiveTheme, fetchCategories, fetchFeaturedProducts, fetchInfluencerHighlights, fetchSaleHighlights } from "../features/home/api";
import { EmptyState } from "../shared/components/EmptyState";

import { InfluencerBanner } from "../components/common/InfluencerBanner";
import { HomeSidebar } from "../features/home/components/HomeSidebar";

function HomeSkeleton() {
  return (
    <div className="space-y-16 pb-16 md:space-y-20">
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
  const [state, setState] = useState({
    loading: true,
    theme: null,
    featured: [],
    sales: [],
    influencerCollections: [],
    categories: [],
    categoriesLoading: true
  });

  const { data: catalogData, loading: catalogLoading, error: catalogError } = useQuery(GET_PRODUCTS, {
    variables: { page: 1, limit: 20 }
  });

  // console.log(catalogData)



  useEffect(() => {
    let active = true;

    async function loadHome() {
      try {
        const [theme, featured, sales, influencer, cats] = await Promise.all([
          fetchActiveTheme(),
          fetchFeaturedProducts(),
          fetchSaleHighlights(),
          fetchInfluencerHighlights(8),
          fetchCategories()
        ]);
        if (!active) return;
        setState({
          loading: false,
          theme: theme ?? null,
          featured: featured ?? [],
          sales: sales ?? [],
          influencerCollections: influencer?.influencerCollections ?? [],
          categories: cats || [],
          categoriesLoading: false
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

  const heroImage = state.theme?.assets?.heroImage || state.theme?.assets?.bannerImage || null;
  const heroTitle = state.theme?.name || "Discover curated fashion collections.";
  const heroDescription = state.theme?.description || "Premium clothes and accessories from top collections and creators.";

  if (state.loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="w-full pb-16">
      {/* Desktop 2-Column Layout */}
      <div className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-start">
        
        {/* LEFT MAIN CONTENT (Hero + Categories + Products) */}
        <div className="flex-1 min-w-0 space-y-6 md:space-y-8">
          <section className="w-full">
        <HeroSlider
          theme={state.theme}
          fallbackImage={null}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div><p className="vy-eyebrow">Curated for you</p><h2 className="vy-section-title mt-1">Shop By Category</h2></div>
        </div>
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 hide-scrollbar">
          {state.categoriesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 w-[220px] flex-none animate-pulse rounded-[16px] bg-vy-surface-muted md:h-40 md:w-[250px]" />
            ))
          ) : (
            state.categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="group relative w-[260px] flex-none snap-center overflow-hidden rounded-2xl text-left shadow-[var(--vy-shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--vy-shadow-hover)] md:w-[320px]"
              >
                <div className="absolute inset-0 h-full w-full">
                  <img
                    src={`https://picsum.photos/seed/${cat}/400/400`}
                    alt={cat}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90" />
                </div>
                <div className="relative flex h-32 flex-col justify-end p-4 md:h-40">
                  <p className="mb-1 text-xl font-extrabold tracking-tight capitalize text-white md:text-2xl">{cat} Collection</p>
                  <p className="line-clamp-1 text-xs font-medium text-slate-200 md:text-sm">Explore premium {cat} products.</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div><p className="vy-eyebrow">Limited moments</p><h2 className="vy-section-title mt-1">Special Offers</h2></div>
          <Link to="/sales" className="text-sm font-semibold text-vy-accent hover:underline">All deals</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 content-stretch">
          {state.sales.map((sale) => (
            <Link key={sale._id} to="/sales" className="group relative overflow-hidden rounded-2xl bg-vy-surface shadow-[var(--vy-shadow)] transition hover:-translate-y-0.5 hover:shadow-[var(--vy-shadow-hover)]">
              <div className="relative h-28 w-full bg-[#211d2a]">
                {sale.bannerImage ? <img src={sale.bannerImage} alt={sale.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" referrerPolicy="no-referrer" /> : null}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                <div className="absolute bottom-2 left-2">
                  <span className="inline-block rounded-full bg-vy-accent px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">{sale.type || "Special Deal"}</span>
                </div>
              </div>
              <div className="p-2.5">
                <h3 className="line-clamp-1 font-[Outfit] text-sm font-semibold tracking-tight text-vy-text group-hover:text-vy-accent">{sale.title}</h3>
                <p className="line-clamp-1 text-[11px] text-vy-muted">{sale.saleLabel || "Shop now"}</p>
              </div>
            </Link>
          ))}
        </div>
        {!state.sales.length ? <EmptyState title={`No sales available.`} /> : null}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div><p className="vy-eyebrow">New arrivals</p><h2 className="vy-section-title mt-1">New Season Essentials</h2></div>
          <Link to="/products" className="text-sm font-semibold text-vy-accent hover:underline">All Products</Link>
        </div>
        <FeaturedCarousel products={state.featured.slice(0, 10)} />
      </section>
      
      <section className="py-4">
        <InfluencerBanner />
      </section>

      <section className="space-y-4">
        <div><p className="vy-eyebrow">Creator edit</p><h2 className="vy-section-title mt-1">Influencers Collection</h2></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {state.influencerCollections.map((link) => (
            <Link key={link._id} to={`/products/${link.product?._id}`} className="vy-card group overflow-hidden">
              <div className="relative h-56 overflow-hidden">
                <img src={link.product?.images?.[0] || ""} alt={link.title || link.product?.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                <span className="absolute left-3 top-3 rounded-full bg-vy-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {link.saleLabel || "Collection"}
                </span>
              </div>
              <div className="space-y-1 p-4">
                <h3 className="font-[Outfit] text-lg font-semibold tracking-tight text-vy-text">{link.title || link.product?.name}</h3>
                <p className="text-sm text-vy-muted">{link.caption || "Curated by influencer"}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-vy-muted">By {link.influencer?.name || "Influencer"}</p>
              </div>
            </Link>
          ))}
        </div>
          </section>
        </div> {/* End Left Main Content */}

        {/* RIGHT SIDEBAR (Promos & Deals) */}
        <aside className="hidden lg:flex lg:w-[290px] shrink-0 lg:flex-col lg:gap-6 lg:sticky lg:top-6 self-start">
          <HomeSidebar />
        </aside>

      </div> {/* End 2-Column Layout */}

      {/* Amazon-like Full Catalog Display at Bottom (Full Width) */}
      <section className="mt-10 space-y-5 border-t border-vy-border pt-10">
        <div className="flex items-end justify-between gap-4">
          <div><p className="vy-eyebrow">Browse more</p><h2 className="vy-section-title mt-1">Today&apos;s Deals & Explore</h2></div>
        </div>

        {catalogLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 15 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : catalogError ? (
          <div className="rounded-xl bg-rose-50 p-6 border border-rose-200 text-center">
            <h3 className="text-lg font-bold text-rose-800">Connection Interrupted</h3>
            <p className="text-sm font-medium text-rose-700 mt-1">Failed to load the product catalog securely. [{catalogError.message}]</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {catalogData?.getProducts?.items?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
