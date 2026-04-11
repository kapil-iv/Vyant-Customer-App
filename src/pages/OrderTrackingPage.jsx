import { useParams } from "react-router-dom";
import { useOrderTimelineQuery } from "../features/orders/hooks";

const FALLBACK_STEPS = ["confirmed", "shipped", "out_for_delivery", "delivered"];

export function OrderTrackingPage() {
  const { id } = useParams();
  const timelineQuery = useOrderTimelineQuery(id, true);

  const timeline = timelineQuery.data?.length
    ? timelineQuery.data.map((event) => String(event.status ?? "").toLowerCase())
    : ["confirmed"];

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Track Order #{id?.slice(-8)}</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <ol className="space-y-3">
          {FALLBACK_STEPS.map((step, index) => {
            const active = timeline.includes(step);
            return (
              <li key={step} className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${active ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                  {index + 1}
                </span>
                <span className={`text-sm capitalize ${active ? "font-semibold text-slate-900" : "text-slate-500"}`}>{step.replaceAll("_", " ")}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
