import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addWishlistThunk, removeWishlistThunk } from "../../wishlist/wishlistSlice";
import { addToCartThunk, addLocalItem } from "../../cart/cartSlice";
import { Heart, ShoppingCart } from "lucide-react";
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
  <article className="vy-card w-full max-w-[280px] sm:max-w-[300px] md:max-w-[320px] overflow-hidden border border-vy-border bg-vy-surface transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60">
    
    <Link to={`/products/${product._id}`}>
      <div className="relative">
        <img
          src={product.images?.[0] ?? ""}
          alt={product.name}
          className="aspect-[3/3] w-full rounded-t-[12px] object-cover"
          loading="lazy"
        />
        <span className="absolute left-2 top-2 rounded-full bg-teal-700 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white sm:text-[10px]">
          {badge}
        </span>
      </div>
    </Link>

    <div className=" p-1">
      <Link
        to={`/products/${product._id}`}
        className="line-clamp-1 text-[13px] sm:text-sm font-bold tracking-tight hover:underline"
      >
        {product.name}
      </Link>

      <p className="text-[11px] sm:text-xs text-vy-muted">
        {product.category ?? "General"}{" "}
        {product.shop?.shopName ? `• ${product.shop.shopName}` : ""}
      </p>

      {/* <p
        className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold ${
          closed
            ? "bg-vy-surface-muted text-vy-muted"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {closed ? "Shop Closed" : "Shop Open"}
      </p> */}

      <p className="text-sm font-semibold">
        <Price value={product.discountPrice ?? product.price} />
      </p>

      {/* 🔥 RESPONSIVE BUTTON SECTION */}
      <div className="flex flex-row sm:flex-row gap-2 pt-2">
        
        {/* PRIMARY CTA */}
        <button
          className={`
            w-full flex items-center justify-center gap-2
            rounded-[12px] px-3 py-2.5 text-[12px] sm:text-xs font-semibold
            transition-all duration-200
            ${
              closed
                ? "bg-gray-400 text-white cursor-not-allowed"
                : inCart
                ? "bg-green-600 text-white"
                : "bg-gradient-to-r from-sky-500 to-violet-500 text-white hover:opacity-90 active:scale-[0.98]"
            }
          `}
          onClick={handleAddToCart}
          disabled={closed || adding}
        >
          {adding && (
            <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          )}

          {closed
            ? "Unavailable"
            : adding
            ? "Processing"
            : inCart
            ? "Added"
            : <ShoppingCart className="h-4 w-4" />}
        </button>

        {/* WISHLIST BUTTON */}
        <button
          className={`
            w-full sm:w-auto flex items-center justify-center
            rounded-[12px] border px-3 py-2.5
            transition-all duration-200
            ${
              inWishlist
                ? "border-red-200 bg-red-50"
                : "border-vy-border hover:bg-vy-bg"
            }
          `}
          onClick={handleWishlistToggle}
          aria-label={
            inWishlist ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <Heart
            className={`h-4 w-4 transition ${
              inWishlist
                ? "fill-red-500 text-red-500 scale-110"
                : "text-vy-muted"
            }`}
          />
        </button>
      </div>
    </div>
  </article>
);
}