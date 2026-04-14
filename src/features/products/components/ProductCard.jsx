import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addWishlistThunk, removeWishlistThunk } from "../../wishlist/wishlistSlice";
import { addToCartThunk, addLocalItem } from "../../cart/cartSlice";
import { Heart } from "lucide-react";
import { Price } from "../../../shared/components/Price";
import { useToast } from "../../../shared/components/ToastProvider";

function resolveBadge(product) {
  const normalized = String(product?.badge || "").trim();
  if (normalized) return normalized;
  const material = String(product?.materialType || "").toLowerCase();
  if (material.includes("organic")) return "Organic";
  if (Number(product?.stock || 0) > 0 && Number(product?.stock || 0) <= 5) return "Limited Edition";
  return "New";
}

function isShopClosed(product) {
  const status = String(product?.shop_status || product?.shop?.shop_status || "").toLowerCase();
  if (status === "closed") return true;
  if (product?.shop?.isOpen === false) return true;
  return false;
}

export function ProductCard({ product }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated);
  const wishlistIds = useSelector((s) => s.wishlist.ids);
  const cartItems = useSelector((s) => s.cart.items);
  const [adding, setAdding] = useState(false);

  const inWishlist = wishlistIds.includes(product._id);
  const inCart = cartItems.some((item) => item.product?._id === product._id || item.product === product._id);
  const closed = isShopClosed(product);
  const badge = resolveBadge(product);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.show("Please login to manage your wishlist.", "error");
      return;
    }
    try {
      if (inWishlist) {
        await dispatch(removeWishlistThunk(product._id)).unwrap();
        toast.show("Removed from wishlist.", "success");
      } else {
        await dispatch(addWishlistThunk(product._id)).unwrap();
        toast.show("Added to wishlist.", "success");
      }
    } catch (err) {
      toast.show(err?.message || "Wishlist update failed.", "error");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (inCart || closed || adding) return;
    try {
      setAdding(true);
      if (isAuthenticated) {
        await dispatch(addToCartThunk({ product, quantity: 1 })).unwrap();
      } else {
        dispatch(addLocalItem({ product, quantity: 1 }));
      }
      toast.show("Added to cart.", "success");
    } catch (err) {
      toast.show(err?.message || "Add to cart failed.", "error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="vy-card overflow-hidden border border-vy-border bg-vy-surface transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60">
      <Link to={`/products/${product._id}`}>
        <div className="relative">
          <img src={product.images?.[0] ?? ""} alt={product.name} className="aspect-[4/5] w-full rounded-t-[12px] object-cover" loading="lazy" />
          <span className="absolute left-3 top-3 rounded-full bg-teal-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {badge}
          </span>
        </div>
      </Link>
      <div className="space-y-2 p-3">
        <Link to={`/products/${product._id}`} className="line-clamp-1 text-sm font-bold tracking-tight hover:underline">{product.name}</Link>
        <p className="text-xs text-vy-muted">
          {product.category ?? "General"} {product.shop?.shopName ? `• ${product.shop.shopName}` : ""}
        </p>
        <p className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${closed ? "bg-vy-surface-muted text-vy-muted" : "bg-emerald-100 text-emerald-700"}`}>
          {closed ? "Shop Closed" : "Shop Open"}
        </p>
        <p className="text-sm font-semibold"><Price value={product.discountPrice ?? product.price} /></p>
        <div className="flex gap-2 pt-1">
          <button
            className={`vy-primary-btn flex-1 px-2 py-2 text-xs disabled:opacity-60 ${inCart ? "bg-green-600" : ""}`}
            style={inCart ? undefined : { backgroundColor: closed ? "#94a3b8" : "var(--vy-accent)" }}
            onClick={handleAddToCart}
            disabled={closed || adding}
          >
            {closed ? "Unavailable" : adding ? "Processing..." : inCart ? "Added" : "Add to Cart"}
          </button>
          <button className="flex items-center justify-center rounded-[12px] border px-3 py-2 transition hover:bg-vy-bg" onClick={handleWishlistToggle} aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
            <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-vy-muted"}`} />
          </button>
        </div>
      </div>
    </article>
  );
}
