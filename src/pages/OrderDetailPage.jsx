import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { useToast } from "../context/ToastContext";
import { useOrderDetailQuery, useOrderTimelineQuery, useRequestReturnMutation } from "../features/orders/hooks";

export function OrderDetailPage() {
  const { id } = useParams();
  const { push } = useToast();
  const [reason, setReason] = useState("");
  const [itemId, setItemId] = useState("");

  const orderDetailQuery = useOrderDetailQuery(id, true);
  const timelineQuery = useOrderTimelineQuery(id, true);
  const returnMutation = useRequestReturnMutation();

  const order = orderDetailQuery.data;

  if (orderDetailQuery.isLoading) {
    return <LoadingState label="Loading order details..." />;
  }

  if (orderDetailQuery.isError) {
    return <ErrorState message={orderDetailQuery.error.message} actionLabel="Retry" onAction={() => orderDetailQuery.refetch()} />;
  }

  if (!order) {
    return <ErrorState message="Order not found" />;
  }

  const items = Array.isArray(order.items) ? order.items : [];

  async function submitReturn(event) {
    event.preventDefault();
    if (!reason.trim()) {
      push("Return reason is required", "error");
      return;
    }

    try {
      await returnMutation.mutateAsync({
        orderId: id,
        payload: {
          reason: reason.trim(),
          itemId: itemId || undefined
        }
      });
      setReason("");
      setItemId("");
      push("Return request submitted", "success");
    } catch (error) {
      push(error.message, "error");
    }
  }

  return (
    <section className="space-y-4">
      <Link to="/orders" className="text-sm text-slate-700 hover:underline">
        Back to orders
      </Link>

      <article className="rounded-xl border border-slate-200 bg-white p-4">
        <h1 className="text-xl font-semibold text-slate-900">Order #{(order._id ?? order.id ?? "").slice(-8)}</h1>
        <p className="text-sm text-slate-600">Status: {order.status ?? "pending"}</p>
        {order.returnStatus ? <p className="text-sm text-amber-700">Return status: {order.returnStatus}</p> : null}
        <p className="mt-1 text-sm font-medium text-slate-800">Total: Rs. {Number(order.totalAmount ?? order.total ?? 0).toFixed(2)}</p>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Items</h2>
        <div className="mt-2 space-y-2">
          {items.map((item, index) => (
            <div key={item._id ?? index} className="rounded-md border border-slate-200 p-2 text-sm text-slate-700">
              <p className="font-medium text-slate-900">{item.product?.name ?? item.name ?? `Item ${index + 1}`}</p>
              <p>Qty: {item.quantity}</p>
              <p>Price: Rs. {Number(item.price ?? item.amount ?? 0).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Tracking timeline</h2>
        {timelineQuery.isLoading ? <p className="mt-2 text-sm text-slate-600">Loading timeline...</p> : null}
        <div className="mt-2 space-y-2">
          {(timelineQuery.data ?? []).map((event, index) => (
            <div key={`${event.status}-${event.at ?? index}`} className="rounded-md border border-slate-200 p-2 text-sm text-slate-700">
              <p className="font-medium text-slate-900">{event.status ?? "Update"}</p>
              <p>{event.note ?? "No details"}</p>
              <p className="text-xs text-slate-500">{event.at ? new Date(event.at).toLocaleString() : "Time unavailable"}</p>
            </div>
          ))}
          {!timelineQuery.isLoading && !(timelineQuery.data ?? []).length ? <p className="text-sm text-slate-500">Timeline updates unavailable.</p> : null}
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Request return</h2>
        <form onSubmit={submitReturn} className="mt-3 space-y-2">
          <label className="block text-sm text-slate-700">
            Return scope
            <select value={itemId} onChange={(event) => setItemId(event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
              <option value="">Full order</option>
              {items.map((item, index) => (
                <option key={item._id ?? index} value={item._id ?? item.product?._id ?? String(index)}>
                  {item.product?.name ?? item.name ?? `Item ${index + 1}`}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-slate-700">
            Reason
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Describe reason for return"
            />
          </label>
          <button
            type="submit"
            disabled={returnMutation.isPending}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {returnMutation.isPending ? "Submitting..." : "Submit return request"}
          </button>
        </form>
      </article>
    </section>
  );
}
