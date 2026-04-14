import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  removeLocalItem,
  updateLocalItemQuantity,
  removeFromCartThunk,
  updateCartItemThunk
} from "../cartSlice";
import { Price } from "../../../shared/components/Price";
import { Trash2, Minus, Plus } from "lucide-react"; // Icons for better UI

export function CartItem({ item }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Destructuring based on your new object structure
  const { _id: cartItemId, product, quantity } = item;
  
  // Destructuring product details
  const { 
    _id: productId, 
    name, 
    images, 
    price, 
    originalPrice, 
    stock,
    // Note: selectedSize/Color handle karne ke liye agar object mein bad mein add hon toh:
    selectedSize,
    selectedColor 
  } = product || {};

  const handleQuantityChange = (newQuantity) => {
    // Stock check to prevent increasing beyond limit
    if (newQuantity > stock) return; 
    
    if (isAuthenticated) {
      dispatch(updateCartItemThunk({ 
        cartItemId: cartItemId, 
        quantity: newQuantity 
      }));
    } else {
      dispatch(updateLocalItemQuantity({ 
        cartItemId: cartItemId, 
        quantity: newQuantity 
      }));
    }
  };

  const handleRemove = () => {
    if (isAuthenticated) {
      dispatch(removeFromCartThunk(cartItemId));
    } else {
      dispatch(removeLocalItem(cartItemId));
    }
  };

  if (!product) return null;

  return (
    <div className="flex gap-4 border-b border-vy-border py-6 group">
      {/* Product Image */}
      <Link to={`/products/${productId}`} className="shrink-0">
        <img
          src={images?.[0] ?? "https://via.placeholder.com/150"}
          alt={name}
          className="h-28 w-24 rounded-xl object-cover border border-vy-border shadow-sm"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        {/* Name and Price Row */}
        <div className="flex justify-between items-start">
          <div className="text-left">
            <Link to={`/products/${productId}`} className="font-bold text-vy-text hover:text-blue-600 transition-colors line-clamp-1">
              {name}
            </Link>
            <div className="mt-1 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider text-vy-muted">
              {selectedSize && <span className="bg-vy-surface-muted px-2 py-0.5 rounded">Size: {selectedSize}</span>}
              {selectedColor && <span className="bg-vy-surface-muted px-2 py-0.5 rounded">Color: {selectedColor}</span>}
              <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">In Stock: {stock}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-black text-vy-text">
              <Price value={price * quantity} />
            </div>
            {originalPrice > price && (
              <div className="text-[10px] text-vy-muted line-through font-bold">
                <Price value={originalPrice * quantity} />
              </div>
            )}
          </div>
        </div>

        {/* Quantity and Actions Row */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex items-center bg-vy-bg rounded-lg p-1 border border-vy-border">
            <button
              className="p-1 text-vy-muted hover:bg-vy-surface hover:shadow-sm rounded-md disabled:opacity-30 transition-all"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            
            <span className="px-4 text-sm font-black text-vy-text">{quantity}</span>
            
            <button
              className="p-1 text-vy-muted hover:bg-vy-surface hover:shadow-sm rounded-md disabled:opacity-30 transition-all"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= stock}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="flex items-center gap-1.5 text-xs font-black text-red-500 hover:text-red-700 uppercase tracking-tighter transition-colors"
          >
            <Trash2 size={14} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}