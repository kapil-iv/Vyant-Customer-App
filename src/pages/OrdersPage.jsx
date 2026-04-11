import { Link } from "react-router-dom";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { useOrdersQuery } from "../features/orders/hooks";

export function OrdersPage() {
  const ordersQuery = useOrdersQuery(true);

  if (ordersQuery.isLoading) {
    return <LoadingState label="Loading orders..." />;
  }

  if (ordersQuery.isError) {
    return <ErrorState message={ordersQuery.error.message} actionLabel="Retry" onAction={() => ordersQuery.refetch()} />;
  }

  const orders = ordersQuery.data ?? [];

  if (!orders.length) {
    return <EmptyState title="No orders yet" subtitle="Your placed orders will appear here." />;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order._id ?? order.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">Order #{(order._id ?? order.id ?? "").slice(-8)}</p>
                <p className="text-xs text-slate-500">Status: {order.status ?? "pending"}</p>
                {order.returnStatus ? <p className="text-xs text-amber-700">Return: {order.returnStatus}</p> : null}
              </div>
              <p className="text-sm font-semibold text-slate-900">Rs. {Number(order.totalAmount ?? order.total ?? 0).toFixed(2)}</p>
            </div>

            <div className="mt-3 flex justify-end">
              <Link to={`/orders/${order._id ?? order.id}`} className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
