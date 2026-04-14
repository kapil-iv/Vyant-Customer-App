import { Link, useParams } from "react-router-dom";

export function OrderSuccessPage() {
  const { id } = useParams();

  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-emerald-200 bg-vy-surface p-6 text-center">
      <p className="text-sm font-medium text-emerald-700">Order Confirmed</p>
      <h1 className="mt-1 text-2xl font-bold text-vy-text">Thank you for your purchase</h1>
      <p className="mt-2 text-sm text-vy-muted">Order ID: {id}</p>

      <div className="mt-5 flex justify-center gap-2">
        <Link to="/" className="rounded-md border border-vy-border px-3 py-2 text-sm text-vy-muted">
          Continue Shopping
        </Link>
        <Link to={`/orders/track/${id}`} className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
          Track Order
        </Link>
      </div>
    </section>
  );
}
