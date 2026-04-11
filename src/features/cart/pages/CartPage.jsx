import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CartItem } from "../components/CartItem";
import { Price } from "../../../shared/components/Price";
import { fetchCartThunk } from "../cartSlice";

export function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartThunk());
    }
  }, [dispatch, isAuthenticated]);

  const subtotal = items.reduce((total, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return total + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1; // Example 10% tax
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-slate-500">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/"
          className="mt-6 rounded-md bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="rounded-xl border bg-white px-6 shadow-sm">
            {items.map((item) => (
              <CartItem key={item.cartItemId + "-" + item.product._id} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-xl border bg-white p-6 shadow-sm sticky top-20">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal ({items.length} items)</span>
                <span className="font-medium"><Price value={subtotal} /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax Estimation (10%)</span>
                <span className="font-medium"><Price value={tax} /></span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-base font-bold">
              <span>Order Total</span>
              <span><Price value={total} /></span>
            </div>

            <button
              className="mt-6 w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="mt-4 block w-full text-center text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
