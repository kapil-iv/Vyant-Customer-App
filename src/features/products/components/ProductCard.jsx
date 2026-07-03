import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addWishlistThunk, removeWishlistThunk } from "../../wishlist/wishlistSlice";
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
  const navigate = useNavigate();
  const toast = useToast();
  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated);
  const wishlistIds = useSelector((s) => s.wishlist.ids) || [];

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

  return (
    <article className="group relative flex flex-col w-full max-w-[280px] sm:max-w-[320px] overflow-hidden border border-vy-border bg-vy-surface transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 rounded-[12px]">
      
      {/* IMAGE SECTION */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0] ?? ""}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* BADGE (Teal 700 Restored) */}
        <span className="absolute left-2 top-2 rounded-full bg-teal-700 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm sm:text-[10px]">
          {badge}
        </span>

        {/* FLOATING WISHLIST (UX FIX: Better for Mobile thumb reach) */}
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

        <div className="mt-3 flex items-center justify-between">
          <p className="text-base sm:text-lg font-bold text-slate-900">
            <Price value={product.discountPrice ?? product.price} />
          </p>
        </div>

        {/* ACTION BUTTON (Restored Original Gradients) */}
        <div className="mt-4">
          <button
            className={`
              w-full flex items-center justify-center gap-2
              rounded-xl px-4 py-3 text-xs font-bold
              transition-all duration-200
              ${
                closed
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-violet-500 text-white hover:opacity-90 active:scale-[0.97] shadow-lg shadow-sky-100"
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