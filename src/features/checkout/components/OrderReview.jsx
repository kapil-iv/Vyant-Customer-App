import { Price } from "../../../shared/components/Price";

export function OrderReview({ cart }) {
  return (
    <div className="rounded border bg-vy-surface p-3">
      <h3 className="font-semibold">Order Review</h3>
      <div className="mt-2 space-y-1 text-sm">
        {cart.items.map((item) => (
          <p key={item._id}>{item.product?.name} x {item.quantity}</p>
        ))}
      </div>
      <p className="mt-2 text-sm">Subtotal: <Price value={cart.subtotal} /></p>
    </div>
  );
}
