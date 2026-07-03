import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Loader } from "../../../shared/components/Loader";
import { ErrorState } from "../../../shared/components/ErrorState";
import { addWishlistThunk, removeWishlistThunk } from "../../wishlist/wishlistSlice";
import { addLocalItem, addToCartThunk, updateCartItemThunk, updateLocalItemQuantity } from "../../cart/cartSlice";
import { fetchProductById } from "../api";
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
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistIds = useSelector((state) => state.wishlist.ids);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [cartActionLoading, setCartActionLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleAddWishlist = async () => {
    try {
      setWishlistLoading(true);
      await dispatch(addWishlistThunk(id)).unwrap();
      toast.show("Added to wishlist.", "success");
    } catch (err) {
      toast.show(err?.message || "Wishlist update failed.", "error");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRemoveWishlist = async () => {
    try {
      setWishlistLoading(true);
      await dispatch(removeWishlistThunk(id)).unwrap();
      toast.show("Removed from wishlist.", "success");
    } catch (err) {
      toast.show(err?.message || "Wishlist update failed.", "error");
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    setStatus("loading");
    fetchProductById(id)
      .then((p) => {
        if (p.status !== "active") {
          setError("This product is no longer available.");
          setStatus("failed");
          return;
        }
        setProduct(p);
        setActiveImage(0);
        setSelectedSize("");
        setSelectedColor("");
        setSelectedVolume("");
        setSelectedUnit("");

        // Auto-select first unit if available
        if (p.unitType && p.unitType !== "piece" && p.allowedUnits?.length > 0) {
          setSelectedUnit(p.allowedUnits[0]);
        }

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
  const requiresVolume = product?.productType === "perfume" && Array.isArray(product?.attributes?.ml) && product.attributes.ml.length > 0;
  const requiresUnit = product?.unitType && product.unitType !== "piece" && Array.isArray(product?.allowedUnits) && product.allowedUnits.length > 0;

  const canAdd =
    (!requiresSize || selectedSize) &&
    (!requiresColor || selectedColor) &&
    (!requiresVolume || selectedVolume) &&
    (!requiresUnit || selectedUnit) &&
    !isShopClosed(product) &&
    Number(product?.stock || 0) > 0;

  const inWishlist = wishlistIds.includes(product?._id || id);
  const matchingCartItem = cartItems.find((item) => {
    const productId = item.product?._id || item.product;
    if (String(productId) !== String(product?._id || id)) return false;
    const itemSize = item.selectedSize || item.size || "";
    const itemColor = item.selectedColor || item.color || "";
    const itemVolume = item.selectedVolume || item.volume || "";
    const itemUnit = item.selectedUnit || "";
    const sizeMatches = requiresSize ? itemSize === selectedSize : true;
    const colorMatches = requiresColor ? itemColor === selectedColor : true;
    const volumeMatches = requiresVolume ? itemVolume === selectedVolume : true;
    const unitMatches = requiresUnit ? itemUnit === selectedUnit : true;
    return sizeMatches && colorMatches && volumeMatches && unitMatches;
  });
  const inCart = Boolean(matchingCartItem);

  const images = useMemo(() => (Array.isArray(product?.images) ? product.images : []), [product?.images]);

  useEffect(() => {
    if (!matchingCartItem) return;
    setQuantity(Number(matchingCartItem.quantity || 1));
  }, [matchingCartItem]);

  const updateQuantity = async (nextQuantity) => {
    if (!product) return;
    const bounded = Math.max(1, Math.min(product.stock ?? 1, nextQuantity));
    setQuantity(bounded);

    if (!matchingCartItem) return;

    if (isAuthenticated) {
      dispatch(
        updateCartItemThunk({
          cartItemId: matchingCartItem._id || matchingCartItem.cartItemId,
          quantity: bounded
        })
      );
      return;
    }

    dispatch(
      updateLocalItemQuantity({
        cartItemId: matchingCartItem._id || matchingCartItem.cartItemId,
        quantity: bounded
      })
    );
  };

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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-vy-text">Select Size</p>
              {selectedSize && <span className="text-xs font-bold text-indigo-600">Selected: {selectedSize}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`flex h-12 min-w-[3rem] items-center justify-center rounded-xl border text-sm font-bold transition-all duration-200 ${selectedSize === s
                    ? "border-vy-accent bg-vy-accent text-white shadow-lg shadow-indigo-500/30"
                    : "border-vy-border bg-vy-surface hover:border-vy-accent hover:bg-vy-surface-muted"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {requiresColor && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-vy-text">Select Color</p>
              {selectedColor && <span className="text-xs font-bold text-indigo-600">Selected: {selectedColor}</span>}
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  title={c}
                  className={`group relative flex h-10 min-w-[5rem] items-center justify-center rounded-full border px-4 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${selectedColor === c
                    ? "border-vy-accent bg-vy-accent text-white shadow-lg shadow-indigo-500/30"
                    : "border-vy-border bg-vy-surface hover:border-vy-accent"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {requiresVolume && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-vy-text">Select Volume (ML)</p>
              {selectedVolume && <span className="text-xs font-bold text-indigo-600">Selected: {selectedVolume}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.attributes.ml.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedVolume(v)}
                  className={`flex h-12 min-w-[4rem] items-center justify-center rounded-xl border text-sm font-bold transition-all duration-200 ${selectedVolume === v
                    ? "border-vy-accent bg-vy-accent text-white shadow-lg shadow-indigo-500/30"
                    : "border-vy-border bg-vy-surface hover:border-vy-accent hover:bg-vy-surface-muted"
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}


        <div className="flex flex-wrap items-center gap-2 pt-2">
          <div className="flex items-center border border-vy-border">
            <button
              type="button"
              onClick={() => updateQuantity(quantity - 1)}
              className="px-3 py-2 text-sm font-medium hover:bg-vy-surface-muted"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="min-w-[40px] px-2 text-center text-sm font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(quantity + 1)}
              className="px-3 py-2 text-sm font-medium hover:bg-vy-surface-muted"
              disabled={quantity >= (product.stock ?? 10)}
            >
              +
            </button>
          </div>
          <button
            className="vy-primary-btn flex-1 px-4 py-2 text-sm"
            style={{ backgroundColor: canAdd ? "var(--vy-accent)" : "#94a3b8" }}
            onClick={async () => {
              if (inCart || !canAdd) return;
              setCartActionLoading(true);
              const payload = { product, quantity, selectedSize, selectedColor, selectedVolume, selectedUnit };
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
                setCartActionLoading(false);
              }
            }}
            disabled={!canAdd || inCart || cartActionLoading}
          >
            {!canAdd ? "Select Options" : inCart ? "Added" : cartActionLoading ? "Adding..." : "Add to Cart"}
          </button>
          <button
            className="rounded-[12px] border px-3 py-2 text-sm"
            onClick={inWishlist ? handleRemoveWishlist : handleAddWishlist}
            disabled={wishlistLoading}
          >
            {wishlistLoading ? "Updating..." : inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </article>

      <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
        <ReviewList productId={id} />
        <ReviewForm productId={id} />
      </div>
    </section>
  );
}
