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
      <h1 className="text-2xl font-semibold text-vy-text">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order._id ?? order.id} className="rounded-xl border border-vy-border bg-vy-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-vy-text">Order #{(order._id ?? order.id ?? "").slice(-8)}</p>
                <p className="text-xs text-vy-muted">Status: {order.status ?? "pending"}</p>
                {order.returnStatus ? <p className="text-xs text-amber-700">Return: {order.returnStatus}</p> : null}
              </div>
              <p className="text-sm font-semibold text-vy-text">Rs. {Number(order.totalAmount ?? order.total ?? 0).toFixed(2)}</p>
            </div>

            <div className="mt-3 flex justify-end">
              <Link to={`/orders/${order._id ?? order.id}`} className="rounded-md border border-vy-border px-3 py-2 text-sm text-vy-muted">
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
