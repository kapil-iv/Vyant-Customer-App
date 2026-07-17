import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addWishlistThunk, removeWishlistThunk } from "../../wishlist/wishlistSlice";
import { addLocalItem, addToCartThunk } from "../../cart/cartSlice";
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
  const navigate = useNavigate();
  const toast = useToast();
  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated);
  const wishlistIds = useSelector((s) => s.wishlist.ids) || [];
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const inWishlist = wishlistIds.includes(product._id);
  const closed = isShopClosed(product);
  const badge = resolveBadge(product);
  const requiresOptions =
    (Array.isArray(product?.sizes) && product.sizes.length > 0) ||
    (Array.isArray(product?.colors) && product.colors.length > 0) ||
    (product?.productType === "perfume" && Array.isArray(product?.attributes?.ml) && product.attributes.ml.length > 0) ||
    (product?.unitType && product.unitType !== "piece" && Array.isArray(product?.allowedUnits) && product.allowedUnits.length > 0);
  const outOfStock = product?.stock != null && Number(product.stock) <= 0;

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

    if (requiresOptions) {
      toast.show("Please select product options before adding to cart.", "error");
      navigate(`/products/${product._id}`);
      return;
    }

    setIsAddingToCart(true);
    const payload = { product, quantity: 1 };

    try {
      if (isAuthenticated) {
        await dispatch(addToCartThunk(payload)).unwrap();
      } else {
        dispatch(addLocalItem(payload));
      }
      toast.show("Added to cart successfully.", "success");
    } catch (err) {
      toast.show(err?.message || "Add to cart failed.", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <article className="vy-card group relative w-full max-w-[280px] overflow-hidden sm:max-w-[320px]">
      
      {/* IMAGE SECTION */}
      <div className="relative aspect-[4/5] overflow-hidden bg-vy-surface-muted">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0] ?? ""}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* BADGE (Teal 700 Restored) */}
        <span className="absolute left-3 top-3 rounded-full bg-vy-accent px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-white shadow-sm sm:text-[10px]">
          {badge}
        </span>

        {/* FLOATING WISHLIST (UX FIX: Better for Mobile thumb reach) */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute right-2 top-2 p-2 rounded-full shadow-md transition-all active:scale-90 ${
            inWishlist ? "bg-red-50" : "vy-glass hover:bg-white"
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
          className="vy-card-title line-clamp-1 text-sm hover:text-vy-accent sm:text-base"
        >
          {product.name}
        </Link>

        <p className="mt-0.5 text-[11px] sm:text-xs text-vy-muted font-medium">
          {product.category ?? "General"}
          {product.shop?.shopName ? ` • ${product.shop.shopName}` : ""}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p className="vy-price text-base sm:text-lg">
            <Price value={product.discountPrice ?? product.price} />
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`
              flex items-center justify-center gap-2 rounded-full px-3 py-3 text-xs font-semibold transition-all duration-200
              ${
                closed || outOfStock
                  ? "cursor-not-allowed bg-gray-400 text-white"
                  : "border border-vy-accent text-vy-accent hover:bg-[var(--vy-primary-soft)] active:scale-[0.97]"
              }
            `}
            onClick={handleAddToCart}
            disabled={closed || outOfStock || isAddingToCart}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {closed || outOfStock ? "Unavailable" : isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
          <button
            type="button"
            className={`
              flex items-center justify-center gap-2 rounded-full px-3 py-3 text-xs font-semibold
              transition-all duration-200
              ${
                closed
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-primary-gradient text-white hover:opacity-90 active:scale-[0.97] shadow-lg shadow-violet-500/20"
              }
            `}
            onClick={handleBuyNow}
            disabled={closed}
          >
            {closed ? (
              "Unavailable"
            ) : (
              <span>Buy Now</span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
