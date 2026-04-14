import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../../../shared/components/Loader";
import { OrderTimeline } from "../components/OrderTimeline";
import { ReturnOrderForm } from "../components/ReturnOrderForm";
import { cancelOrderApi, fetchOrderByIdApi, fetchOrderTimelineApi, returnOrderApi } from "../orderApi";
import { Price } from "../../../shared/components/Price";
import { getStatusColor } from "./OrdersPage";

export function OrderDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [timelineData, setTimelineData] = useState({ timeline: [], trackingStatus: "", status: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [detail, timelineResponse] = await Promise.all([fetchOrderByIdApi(id), fetchOrderTimelineApi(id)]);
    setOrder(detail);
    setTimelineData(timelineResponse || { timeline: [], trackingStatus: "", status: "" });
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <Loader label="Retrieving order details..." />;
  if (!order) return <div className="p-8 text-center text-vy-muted font-medium">Order not found.</div>;

  const itemsTotal = order.items?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0) || 0;

  return (
    <section className="mx-auto max-w-5xl space-y-6 py-8 text-vy-text">
      <Link to="/orders" className="flex w-fit items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline">
        &larr; Back to all orders
      </Link>

      <article className="flex flex-col justify-between gap-4 rounded-2xl border border-vy-border bg-vy-surface p-6 shadow-sm md:flex-row md:items-start">
        <div>
          <h1 className="mb-1 text-2xl font-black">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm font-medium text-vy-muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <span className={`inline-flex w-fit items-center justify-center rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          {order.trackingStatus ? (
            <p className="text-sm font-semibold capitalize text-vy-muted">Tracking: <span className="text-vy-text">{order.trackingStatus.replace("_", " ")}</span></p>
          ) : null}
        </div>
      </article>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <article className="rounded-2xl border border-vy-border bg-vy-surface p-6 shadow-sm">
            <h2 className="mb-4 border-b border-vy-border pb-3 text-lg font-bold">Items Ordered</h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item._id} className="flex items-center gap-4 rounded-xl border border-vy-border bg-vy-bg/70 p-3 transition hover:bg-vy-bg">
                  <img src={item.product?.images?.[0] || "https://via.placeholder.com/150"} alt={item.name} className="h-20 w-20 rounded-lg border border-vy-border bg-vy-surface object-cover shadow-sm" />
                  <div className="flex-1">
                    <p className="mb-1 text-base font-bold leading-tight">{item.name}</p>
                    <p className="text-sm font-medium text-vy-muted">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black"><Price value={(item.price || 0) * (item.quantity || 1)} /></p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-vy-border bg-vy-surface p-6 shadow-sm">
            <h2 className="mb-4 border-b border-vy-border pb-3 text-lg font-bold">Tracking Timeline</h2>
            <OrderTimeline events={timelineData.timeline} trackingStatus={timelineData.trackingStatus || order.trackingStatus} />
            {order.deliveryPartner ? (
              <p className="mt-5 inline-block rounded-lg border border-vy-border bg-vy-bg p-3 text-sm font-bold text-vy-muted shadow-sm">
                Carrier: <span className="uppercase tracking-wider text-indigo-600">{order.deliveryPartner}</span>
              </p>
            ) : null}
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-2xl border border-vy-border bg-vy-bg p-6 shadow-sm">
            <h2 className="mb-4 border-b border-vy-border pb-3 text-lg font-bold">Payment Summary</h2>
            <div className="mb-4 space-y-3 text-sm font-medium text-vy-muted">
              <div className="flex justify-between">
                <span>Subtotal ({order.items?.length || 0} items)</span>
                <span className="text-vy-text"><Price value={itemsTotal} /></span>
              </div>
              {order.platformFee > 0 ? (
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="text-vy-text"><Price value={order.platformFee} /></span>
                </div>
              ) : null}
              <div className="flex items-center justify-between border-t border-vy-border pt-4 text-lg font-black text-vy-text">
                <span>Total Paid</span>
                <span><Price value={order.totalAmount ?? 0} /></span>
              </div>
            </div>
          </article>

          {['pending', 'processing'].includes(order.status) ? (
            <article className="rounded-2xl border border-red-100 bg-red-50/80 p-5 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-red-600">Need to cancel?</p>
              <button
                className="w-full rounded-xl border border-red-200 bg-vy-surface px-4 py-3 text-sm font-bold text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50"
                onClick={async () => {
                  if (window.confirm("Are you absolutely sure you want to cancel this order?")) {
                    await cancelOrderApi(id);
                    await load();
                  }
                }}
              >
                Cancel Order
              </button>
            </article>
          ) : null}

          {order.status === "delivered" && order.refundStatus === "none" ? (
            <article className="rounded-2xl border border-vy-border bg-vy-surface p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-vy-muted">Return Items</h2>
              <ReturnOrderForm
                submitting={submitting}
                onSubmit={async (payload) => {
                  setSubmitting(true);
                  await returnOrderApi(id, payload);
                  setSubmitting(false);
                  await load();
                }}
              />
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
