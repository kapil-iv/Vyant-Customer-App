import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Loader } from "../../../shared/components/Loader";
import { ErrorState } from "../../../shared/components/ErrorState";
import { addWishlistThunk, removeWishlistThunk } from "../../wishlist/wishlistSlice";
import { addLocalItem, addToCartThunk } from "../../cart/cartSlice";
import { fetchProductById } from "../productApi";
import { ReviewForm } from "../../reviews/components/ReviewForm";
import { ReviewList } from "../../reviews/components/ReviewList";
import { useToast } from "../../../shared/components/ToastProvider";

function isShopClosed(product) {
  const status = String(product?.shop_status || product?.shop?.shop_status || "").toLowerCase();
  return status === "closed" || product?.shop?.isOpen === false;
}

export function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  const handleAddWishlist = async () => {
    try {
      await dispatch(addWishlistThunk(id)).unwrap();
      toast.show("Added to wishlist.", "success");
    } catch (err) {
      toast.show(err?.message || "Wishlist update failed.", "error");
    }
  };

  const handleRemoveWishlist = async () => {
    try {
      await dispatch(removeWishlistThunk(id)).unwrap();
      toast.show("Removed from wishlist.", "success");
    } catch (err) {
      toast.show(err?.message || "Wishlist update failed.", "error");
    }
  };

  useEffect(() => {
    setStatus("loading");
    fetchProductById(id)
      .then((p) => {
        setProduct(p);
        setActiveImage(0);
        setStatus("succeeded");
      })
      .catch((e) => {
        setError(e.message);
        setStatus("failed");
      });
  }, [id]);

  const requiresSize = Array.isArray(product?.sizes) && product.sizes.length > 0;
  const requiresColor = Array.isArray(product?.colors) && product.colors.length > 0;
  const canAdd = (!requiresSize || selectedSize) && (!requiresColor || selectedColor) && !isShopClosed(product);

  const images = useMemo(() => (Array.isArray(product?.images) ? product.images : []), [product?.images]);

  if (status === "loading") return <Loader label="Loading product..." />;
  if (status === "failed") return <ErrorState message={error} />;

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <img src={images[activeImage] ?? ""} alt={product.name} className="h-96 w-full rounded-[12px] border border-vy-border object-cover" />
        {images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={img + idx}
                type="button"
                className={`h-16 w-16 flex-none overflow-hidden rounded-[12px] border ${idx === activeImage ? "border-slate-900" : "border-vy-border"}`}
                onClick={() => setActiveImage(idx)}
              >
                <img src={img} alt={`${product.name}-${idx}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <article className="vy-card space-y-3 border border-vy-border bg-vy-surface p-4">
        <h1 className="text-2xl font-extrabold tracking-tight">{product.name}</h1>
        <p className="text-sm text-vy-muted">{product.description}</p>
        <p className="text-lg font-semibold">Rs. {product.discountPrice ?? product.price}</p>
        <p className="text-sm">Stock: {product.stock ?? 0}</p>
        {isShopClosed(product) ? <p className="inline-flex rounded-full bg-vy-surface-muted px-3 py-1 text-xs font-semibold text-vy-muted">Shop Closed</p> : null}

        {requiresSize ? (
          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full rounded-[12px] border px-3 py-2 text-sm">
            <option value="">Select size</option>
            {product.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        ) : null}

        {requiresColor ? (
          <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full rounded-[12px] border px-3 py-2 text-sm">
            <option value="">Select color</option>
            {product.colors.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        ) : null}

        {requiresSize && !selectedSize ? <p className="text-xs text-rose-600">Select a size before adding to cart.</p> : null}
        {requiresColor && !selectedColor ? <p className="text-xs text-rose-600">Select a color before adding to cart.</p> : null}

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            className="vy-primary-btn flex-1 px-4 py-2 text-sm"
            style={{ backgroundColor: canAdd ? "var(--vy-accent)" : "#94a3b8" }}
            onClick={() => {
              const payload = { product, quantity: 1, selectedSize, selectedColor };
              if (isAuthenticated) {
                dispatch(addToCartThunk(payload));
              } else {
                dispatch(addLocalItem(payload));
              }
            }}
            disabled={!canAdd}
          >
            {canAdd ? "Add to Cart" : "Select Options"}
          </button>
          <button className="rounded-[12px] border px-3 py-2 text-sm" onClick={handleAddWishlist}>Add to Wishlist</button>
          <button className="rounded-[12px] border px-3 py-2 text-sm" onClick={handleRemoveWishlist}>Remove Wishlist</button>
        </div>
      </article>

      <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
        <ReviewList productId={id} />
        <ReviewForm productId={id} />
      </div>
    </section>
  );
}
