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
  const [quantity, setQuantity] = useState(1);
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
        setSelectedSize("");
        setSelectedColor("");
        setQuantity(1);
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
        
        <div className="flex items-center gap-4 border-y border-vy-border py-3">
          <p className="text-2xl font-bold text-slate-900">Rs. {product.discountPrice ?? product.price}</p>
          {product.price > product.discountPrice && (
            <p className="text-sm text-vy-muted line-through">Rs. {product.price}</p>
          )}
        </div>

        <div className="space-y-2 text-sm">
          {product.category && (
            <p className="flex justify-between">
              <span className="text-vy-muted">Category</span>
              <span className="font-medium">{product.category}</span>
            </p>
          )}
          {product.materialType && (
            <p className="flex justify-between">
              <span className="text-vy-muted">Material</span>
              <span className="font-medium">{product.materialType}</span>
            </p>
          )}
          <p className="flex justify-between">
            <span className="text-vy-muted">Availability</span>
            <span className={`font-medium ${(product.stock ?? 0) > 0 ? "text-green-600" : "text-red-500"}`}>
              {(product.stock ?? 0) > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </p>
          {product.rating !== undefined && (
            <p className="flex justify-between">
              <span className="text-vy-muted">Rating</span>
              <span className="font-medium">{product.rating} / 5</span>
            </p>
          )}
          {product.soldCount !== undefined && (
            <p className="flex justify-between">
              <span className="text-vy-muted">Sold</span>
              <span className="font-medium">{product.soldCount}</span>
            </p>
          )}
        </div>

        {isShopClosed(product) ? <p className="inline-flex rounded-full bg-vy-surface-muted px-3 py-1 text-xs font-semibold text-vy-muted">Shop Closed</p> : null}

{requiresSize && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Size: <span className="font-normal text-vy-muted">{selectedSize || "Select a size"}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-[48px] rounded-[8px] border px-3 py-2 text-sm font-medium transition ${
                    selectedSize === s
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-vy-border hover:border-slate-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {requiresColor && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Color: <span className="font-normal text-vy-muted">{selectedColor || "Select a color"}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`rounded-[8px] border px-4 py-2 text-sm font-medium transition ${
                    selectedColor === c
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-vy-border hover:border-slate-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
)}

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <div className="flex items-center border border-vy-border">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-sm font-medium hover:bg-vy-surface-muted"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="min-w-[40px] px-2 text-center text-sm font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock ?? 10, quantity + 1))}
              className="px-3 py-2 text-sm font-medium hover:bg-vy-surface-muted"
              disabled={quantity >= (product.stock ?? 10)}
            >
              +
            </button>
          </div>
          <button
            className="vy-primary-btn flex-1 px-4 py-2 text-sm"
            style={{ backgroundColor: canAdd ? "var(--vy-accent)" : "#94a3b8" }}
            onClick={() => {
              const payload = { product, quantity, selectedSize, selectedColor };
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
