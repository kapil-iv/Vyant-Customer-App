import { ProductCard } from "../../products/components/ProductCard";

export function FeaturedCarousel({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
      <div className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 pt-2 pr-4 md:pr-0">
        {products.map((product) => (
          <div key={product._id} className="w-[220px] sm:w-[260px] shrink-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `
        }}
      />
    </div>
  );
}
