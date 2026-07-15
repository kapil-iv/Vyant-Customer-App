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
import salebanner from "./assets/salebanner.jpg";
import { LayoutGrid } from "lucide-react";







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
  const [state, setState] = useState({
    loading: true,
    theme: null,
    featured: [],
    sales: [],
    influencerCollections: [],
    categories: [],
    currentCategory: null,
    categoriesLoading: true
  });

  const { data: catalogData, loading: catalogLoading, error: catalogError } = useQuery(GET_PRODUCTS, {
    variables: { page: 1, limit: 20 }
  });
// Line update kar lo component ke andar:
const [isExpanded, setIsExpanded] = useState(false);
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

  const heroImage = state.theme?.assets?.heroImage || state.theme?.assets?.bannerImage || salebanner || null;
  const heroTitle = state.theme?.name || "Discover curated fashion collections.";
  const heroDescription = state.theme?.description || "Premium clothes and accessories from top collections and creators.";

  if (state.loading) {
    return <HomeSkeleton />;
  }



  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 md:py-6">

     {/* ─── SLOT 1: MOBILE ONLY Category Carousel ─── */}
<div className="block md:hidden mb-4">
  <section className="pt-2">
    {/* FIXED: Agar expanded hai to flex-wrap add kiya taaki baki items niche line me smooth show ho sakein */}
    <div className={`flex gap-5 overflow-x-auto pb-2 hide-scrollbar snap-x ${isExpanded ? 'flex-wrap overflow-x-visible' : ''}`}>
      
      {/* 1. ALL DYNAMIC CATEGORIES WITH SLICE CONDITION */}
      {!state.categoriesLoading && state.categories.map((cat, index) => {
        // Agar expanded nahi hai, to index 4 ke baad wale elements ko chhipa do (0,1,2,3 show honge)
        if (!isExpanded && index >= 4) return null;

        return (
          <Link 
            key={cat} 
            to={`/products?category=${cat}`} 
            className="flex flex-col items-center gap-1 group flex-none snap-start animate-fadeIn"
          >
            <div className={`w-14 h-14 rounded-full overflow-hidden transition-all duration-200 border ${
              state.currentCategory === cat ? "border-2 border-indigo-500 shadow-md" : "border-gray-200 dark:border-gray-700"
            }`}>
              <img src={`https://picsum.photos/seed/${cat}/200/200`} alt={cat} className="h-full w-full object-cover" />
            </div>
            <span className={`text-[11px] capitalize ${state.currentCategory === cat ? "font-bold text-indigo-500" : "font-medium text-gray-700 dark:text-gray-300"}`}>{cat}</span>
          </Link>
        );
      })}

      {/* 2. DYNAMIC "ALL" / "LESS" TOGGLE BUTTON */}
      {!state.categoriesLoading && state.categories.length > 4 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-col items-center gap-1 group flex-none snap-start focus:outline-none"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-200 ${
            isExpanded 
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
              : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-indigo-500"
          }`}>
            {/* Custom Simple Plus/Minus or Menu Grid Icon */}
            <span className="text-xl font-bold">{isExpanded ? "−" : "＋"}</span>
          </div>
          <span className="text-[11px] font-bold text-indigo-500">
            {isExpanded ? "Less" : "All"}
          </span>
        </button>
      )}

    </div>
  </section>
</div>
      {/* Main 3-Column Layout Container */}
      {/* <div className="grid grid-cols-10 gap-6 items-start"> */}

        {/* COLUMN 1: Left Sidebar (Shop by Category) */}
        {/* <aside className="hidden md:block col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-sm sticky top-36">
          <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">
            Shop by Category
          </h2>
          <div className="space-y-1">
            <Link to="/products" className={`block text-sm px-2 py-1.5 rounded-lg transition-colors ${!state.currentCategory ? "bg-indigo-50 text-indigo-600 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400" : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"}`}>
              All Categories
            </Link>
            {state.categoriesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-7 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
              ))
            ) : (
              state.categories.map((cat) => (
                <Link key={cat} to={`/products?category=${cat}`} className={`block text-sm px-2 py-1.5 rounded-lg capitalize transition-colors ${state.currentCategory === cat ? "bg-indigo-50 text-indigo-600 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400" : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"}`}>
                  {cat}
                </Link>
              ))
            )}
          </div>
        </aside> */}

        {/* ================= COLUMN 2: CENTER MAIN CONTENT ================= */}
        <main className="col-span-12 md:col-span-7 space-y-6">

          {/* STEP A: Hero Slider Banner */}
          <div className="rounded-2xl overflow-hidden shadow-sm">
            <HeroSlider theme={state.theme} fallbackImage={salebanner} />
          </div>

          {/* STEP B: Desktop Category Carousel */}
          <div className="hidden md:block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar snap-x">
              {/* All Button Desktop */}
              <Link to="/products" className="flex flex-col items-center gap-1.5 group flex-none snap-start">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
                  !state.currentCategory ? "bg-indigo-500 text-white" : "border border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                }`}>
                  <LayoutGrid size={22} />
                </div>
                <span className={`text-xs ${!state.currentCategory ? "font-bold text-indigo-500" : "font-medium text-gray-700 dark:text-gray-300"}`}>
                  All
                </span>
              </Link>

              {/* Dynamic Categories Loop Desktop */}
              {!state.categoriesLoading && state.categories.map((cat) => (
                <Link key={cat} to={`/products?category=${cat}`} className="flex flex-col items-center gap-1.5 group flex-none snap-start">
                  <div className={`w-16 h-16 rounded-full overflow-hidden transition-all duration-200 group-hover:scale-105 border ${
                    state.currentCategory === cat ? "border-2 border-indigo-500 shadow-md" : "border-gray-200 dark:border-gray-700"
                  }`}>
                    <img src={`https://picsum.photos/seed/${cat}/200/200`} alt={cat} className="h-full w-full object-cover" />
                  </div>
                  <span className={`text-xs capitalize ${state.currentCategory === cat ? "font-bold text-indigo-500" : "font-medium text-gray-700 dark:text-gray-300"}`}>
                    {cat}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* STEP C: Shop By Category Cards */}
          {/* <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-vy-text md:text-3xl">Shop By Category</h2>
            </div>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {state.categoriesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 w-[260px] flex-none animate-pulse rounded-[16px] bg-vy-surface-muted md:h-40 md:w-[320px]" />
                ))
              ) : (
                state.categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${cat}`}
                    className="group relative w-[260px] flex-none snap-center overflow-hidden rounded-[16px] border border-vy-border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/20 md:w-[320px]"
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
          </section> */}

          {/* STEP D: Special Offers */}
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-vy-text md:text-3xl">Special Offers</h2>
              <Link to="/sales" className="text-sm font-semibold text-vy-muted hover:text-vy-text">All deals</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 content-stretch">
              {state.sales.map((sale) => (
                <Link key={sale._id} to="/sales" className="group relative overflow-hidden rounded-xl border border-vy-border bg-vy-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-28 w-full bg-slate-900">
                    {sale.bannerImage ? <img src={sale.bannerImage} alt={sale.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" referrerPolicy="no-referrer" /> : null}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-block rounded bg-indigo-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">{sale.type || "Special Deal"}</span>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h3 className="line-clamp-1 text-sm font-bold tracking-tight text-vy-text hover:text-indigo-500">{sale.title}</h3>
                    <p className="line-clamp-1 text-[11px] text-vy-muted">{sale.saleLabel || "Shop now"}</p>
                  </div>
                </Link>
              ))}
            </div>
            {!state.sales.length ? <EmptyState title={`No sales available.`} /> : null}
          </section>

          {/* STEP E: New Season Essentials */}
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-vy-text md:text-3xl">New Season Essentials</h2>
              <Link to="/products" className="text-sm font-semibold text-vy-muted hover:text-vy-text">All Products</Link>
            </div>
            <FeaturedCarousel products={state.featured.slice(0, 10)} />
          </section>

          {/* STEP F: Influencers Collection */}
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-vy-text md:text-3xl">Influencers Collection</h2>
             
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              
              {state.influencerCollections.map((link) => (
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
          </section>

          {/* STEP G: Full Catalog */}
          <section className="space-y-4 pt-10 border-t border-vy-border mt-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-vy-text md:text-3xl">Today's Deals & Explore</h2>
            </div>
            {catalogLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-2">
                {Array.from({ length: 15 }).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : catalogError ? (
              <div className="rounded-xl bg-rose-50 p-6 border border-rose-200 text-center">
                <h3 className="text-lg font-bold text-rose-800">Connection Interrupted</h3>
                <p className="text-sm font-medium text-rose-700 mt-1">Failed to load the product catalog securely. [{catalogError.message}]</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {catalogData?.getProducts?.items?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </section>

        </main>

        {/* COLUMN 3: Right Sidebar (Deals, Offers & Widgets) */}
        <aside className="hidden md:block col-span-3 space-y-6 sticky top-36">
          {/* New Arrivals, Timer Widget box etc... */}
        </aside>

      </div>
    // </div>
  );
}
