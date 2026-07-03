import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "../../../shared/components/Loader";
import { EmptyState } from "../../../shared/components/EmptyState";
import { fetchOrders } from "../api";
import { Price } from "../../../shared/components/Price";

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'delivered': return "bg-green-100 text-green-700 border-green-200";
    case 'shipped': return "bg-blue-100 text-blue-700 border-blue-200";
    case 'processing': return "bg-amber-100 text-amber-700 border-amber-200";
    case 'cancelled':
    case 'returned': return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-vy-surface-muted text-vy-muted border-vy-border";
  }
}

export function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading orders..." />;
  if (!orders.length) return <EmptyState title="No orders yet" description="You haven't placed any orders. Start browsing our collection!" />;

  return (
    <section className="space-y-6 max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-black text-vy-text border-l-4 border-indigo-600 pl-3">My Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <article key={order._id} className="rounded-2xl border border-vy-border bg-vy-surface p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-bold text-lg text-vy-text">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-vy-muted">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="flex flex-col md:items-end pb-2 md:pb-0 border-b md:border-b-0 border-vy-border mb-2 md:mb-0">
                <p className="text-sm text-vy-muted font-medium">Total Amount</p>
                <p className="text-xl font-black text-vy-text"><Price value={order.totalAmount ?? order.total ?? 0} /></p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-vy-border">
              <div className="text-sm text-vy-muted font-medium flex items-center gap-2">
                <span>{order.items?.length || 0} item(s)</span>
                {order.trackingStatus === 'delivered' && order.deliveredAt && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-green-600 font-bold">Delivered {new Date(order.deliveredAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>
              <Link to={`/orders/${order._id}`} className="inline-block rounded-lg bg-slate-900 text-white px-5 py-2 text-sm font-bold shadow-sm hover:bg-slate-800 transition">
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
