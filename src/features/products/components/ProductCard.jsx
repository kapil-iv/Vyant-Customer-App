import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addWishlistThunk, removeWishlistThunk } from "../../wishlist/wishlistSlice";
import { addLocalItem, addToCartThunk } from "../../cart/cartSlice";
import { Heart, ShoppingCart, Star } from "lucide-react";
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
  const navigate = useNavigate();
  const toast = useToast();
  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated);
  const wishlistIds = useSelector((s) => s.wishlist.ids) || [];
  const [cartActionLoading, setCartActionLoading] = useState(false);

  const inWishlist = wishlistIds.includes(product._id);
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

  const handleBuyNow = (e) => {
    e.preventDefault();
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const requiresOptions =
      (Array.isArray(product?.sizes) && product.sizes.length > 0) ||
      (Array.isArray(product?.colors) && product.colors.length > 0) ||
      (product?.productType === "perfume" && Array.isArray(product?.attributes?.ml) && product.attributes.ml.length > 0) ||
      (product?.unitType && product.unitType !== "piece" && Array.isArray(product?.allowedUnits) && product.allowedUnits.length > 0);

    if (requiresOptions) {
      toast.show("Please select product options before adding to cart.", "error");
      navigate(`/products/${product._id}`);
      return;
    }

    try {
      setCartActionLoading(true);
      const payload = { product, quantity: 1, selectedSize: "", selectedColor: "", selectedVolume: "" };
      if (isAuthenticated) {
        await dispatch(addToCartThunk(payload)).unwrap();
      } else {
        dispatch(addLocalItem(payload));
      }
      toast.show("Added to cart successfully.", "success");
    } catch (err) {
      toast.show(err?.message || "Add to cart failed.", "error");
    } finally {
      setCartActionLoading(false);
    }
  };

  return (
    <article className="group relative flex flex-col w-full max-w-[240px] sm:max-w-[280px] overflow-hidden border border-vy-border bg-vy-surface transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 rounded-[12px]">
      
    {/* IMAGE SECTION */}
<div className="relative overflow-hidden bg-slate-50">
  <Link to={`/products/${product._id}`} className="block">
    {Array.isArray(product.images) && product.images.length > 1 ? (
      <div className="grid grid-cols-2 gap-1 h-[220px] sm:h-auto">
        <div className="overflow-hidden rounded-l-[12px]">
          <img
            src={product.images[0] ?? ""}
            alt={product.name}
            className="h-full w-full object-fit transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className=" bg-red-800 overflow-hidden rounded-r-[12px]">
          <img
            src={product.images[1] ?? ""}
            alt={`${product.name} - alternate`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          //outer 
        </div>
      </div>
    ) : (
      <div className="relative h-[220px] sm:aspect-[4/3] overflow-hidden rounded-t-[12px]">
        <img
          src={product.images?.[0] ?? ""}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    )}
  </Link>

  <span className="absolute left-2 top-2 rounded-full bg-teal-700 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm sm:text-[10px]">
    {badge}
  </span>

  <button
    onClick={handleWishlistToggle}
    className={`absolute right-2 top-2 p-2 rounded-full shadow-md transition-all active:scale-90 ${
      inWishlist ? "bg-red-50" : "bg-white/90 hover:bg-white"
    }`}
    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
  >
    <Heart
      className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
        inWishlist ? "fill-red-500 text-red-500" : "text-slate-400"
      }`}
    />
  </button>
</div>

      {/* INFO SECTION */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <Link
          to={`/products/${product._id}`}
          className="line-clamp-1 text-sm sm:text-base font-bold tracking-tight text-slate-800 hover:underline decoration-sky-500 underline-offset-2"
        >
          {product.name}
        </Link>

        <p className="mt-0.5 text-[11px] sm:text-xs text-vy-muted font-medium">
          {product.category ?? "General"}
          {product.shop?.shopName ? ` • ${product.shop.shopName}` : ""}
        </p>

        {/* Rating + reviews */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-slate-900">{(product.rating ?? product.avgRating ?? 0).toFixed(1)}</span>
          </div>
          {product.reviewsCount ? <span className="text-xs text-vy-muted">{product.reviewsCount} reviews</span> : null}
        </div>

        {/* Price + original + discount */}
        <div className="mt-2">
          <p className="text-base sm:text-lg font-bold text-slate-900">
            <Price value={product.discountPrice ?? product.price} />
          </p>

          {product.discountPrice && product.price && product.price > product.discountPrice ? (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-vy-muted line-through">
                <Price value={product.price} />
              </span>
              <span className="text-xs font-semibold text-indigo-600">
                {Math.round(100 - (product.discountPrice / product.price) * 100)}%
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-200 ${
              closed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-500 to-violet-500 hover:opacity-90"
            }`}
            onClick={handleBuyNow}
            disabled={closed}
          >
            {closed ? "Unavailable" : "Buy Now"}
          </button>
          <button
            type="button"
            className="inline-flex w-12 items-center justify-center rounded-xl border border-vy-border bg-vy-surface text-vy-text transition-colors hover:bg-vy-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={closed || Number(product?.stock || 0) <= 0 || cartActionLoading}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
