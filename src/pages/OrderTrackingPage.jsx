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
      <h1 className="text-2xl font-semibold text-vy-text">Track Order #{id?.slice(-8)}</h1>

      <div className="rounded-xl border border-vy-border bg-vy-surface p-4">
        <ol className="space-y-3">
          {FALLBACK_STEPS.map((step, index) => {
            const active = timeline.includes(step);
            return (
              <li key={step} className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${active ? "bg-emerald-600 text-white" : "bg-vy-surface-muted text-vy-muted"}`}>
                  {index + 1}
                </span>
                <span className={`text-sm capitalize ${active ? "font-semibold text-vy-text" : "text-vy-muted"}`}>{step.replaceAll("_", " ")}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
