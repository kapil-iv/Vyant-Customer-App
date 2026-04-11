const STEP_MAP = [
  { key: "created", label: "Created" },
  { key: "accepted", label: "Accepted" },
  { key: "packing", label: "Packing" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" }
];

function normalizeTrackingStatus(value) {
  const status = String(value || "").toLowerCase();
  if (!status) return "created";
  if (status === "preparing") return "accepted";
  if (status === "packed") return "packing";
  if (status === "picked" || status === "in_transit") return "out_for_delivery";
  if (status === "delivered") return "delivered";
  return "created";
}

export function OrderTimeline({ events = [], trackingStatus }) {
  const activeKey = normalizeTrackingStatus(trackingStatus);
  const activeIndex = STEP_MAP.findIndex((step) => step.key === activeKey);

  return (
    <ol className="space-y-0">
      {STEP_MAP.map((step, idx) => {
        const done = idx <= activeIndex;
        const eventMatch = (events || []).find((e) => String(e.key || "").toLowerCase() === step.key);
        const eventTime = eventMatch?.at ? new Date(eventMatch.at).toLocaleString() : "";

        return (
          <li key={step.key} className="relative pl-8">
            {idx < STEP_MAP.length - 1 ? (
              <span className={`absolute left-[11px] top-6 h-[44px] w-[2px] ${done ? "bg-emerald-500" : "bg-slate-200"}`} />
            ) : null}
            <span className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-slate-400"}`}>
              {idx + 1}
            </span>
            <div className="pb-6">
              <p className={`text-sm font-semibold ${done ? "text-slate-900" : "text-slate-500"}`}>{step.label}</p>
              {eventTime ? <p className="text-xs text-slate-500">{eventTime}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
