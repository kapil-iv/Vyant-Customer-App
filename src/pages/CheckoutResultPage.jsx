import { Link, useParams, useSearchParams } from "react-router-dom";

export function CheckoutResultPage() {
  const { state } = useParams();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const isSuccess = state === "success";

  return (
    <section className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">{isSuccess ? "Order successful" : "Order failed"}</h1>
      <p className="mt-2 text-sm text-slate-600">
        {isSuccess ? "Your order has been placed." : "We could not complete your order. Please retry."}
      </p>
      {orderId ? <p className="mt-1 text-xs text-slate-500">Order ID: {orderId}</p> : null}

      <div className="mt-5 flex justify-center gap-2">
        <Link to="/" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
          Continue shopping
        </Link>
        {isSuccess ? (
          <Link to="/orders" className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
            View orders
          </Link>
        ) : (
          <Link to="/checkout" className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
            Retry checkout
          </Link>
        )}
      </div>
    </section>
  );
}
