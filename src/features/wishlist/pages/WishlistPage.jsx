import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Loader } from "../../../shared/components/Loader";
import { fetchWishlistThunk, removeWishlistThunk } from "../wishlistSlice";

export function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((s) => s.wishlist);

  useEffect(() => {
    void dispatch(fetchWishlistThunk());
  }, [dispatch]);

  if (status === "loading") return <Loader label="Loading wishlist..." />;
  if (!items.length) return <EmptyState title="Wishlist is empty" />;

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => {
        const product = item.product ?? item;
        const productId = product._id ?? item.productId;
        return (
          <article key={item._id ?? productId} className="overflow-hidden rounded-md border bg-white">
            <img src={product.images?.[0] ?? ""} alt={product.name} className="h-36 w-full object-cover" loading="lazy" />
            <div className="space-y-2 p-2">
              <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
              <button className="w-full rounded border px-2 py-1 text-xs" onClick={() => dispatch(removeWishlistThunk(productId))}>Remove</button>
              <button className="w-full rounded border px-2 py-1 text-xs" onClick={() => navigate(`/products/${productId}`)}>View</button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
