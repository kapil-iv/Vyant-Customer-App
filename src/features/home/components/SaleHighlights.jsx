import { useNavigate } from "react-router-dom";

export function SaleHighlights({ sales }) {
  const navigate = useNavigate();

  if (!sales || sales.length === 0) return null;

  return (
    <section className="mb-8 flex flex-col gap-4">
      {sales.map((sale) => (
        <button
          key={sale._id}
          type="button"
          className="relative flex w-full flex-col justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 p-5 text-left text-white shadow-md md:flex-row md:items-center md:gap-0 md:p-6"
          onClick={() => navigate("/sales", { state: { selectedSaleId: sale._id } })}
        >
          {sale.bannerImage ? (
            <div
              className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
              style={{ backgroundImage: `url(${sale.bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
          ) : null}

          <div className="relative z-10 flex-1 border-l-4 border-white/40 pl-2">
            <h3 className="flex items-center gap-2 text-2xl font-black uppercase tracking-wide drop-shadow-sm">
              <span className="animate-pulse">⚡</span> {sale.title}
            </h3>
            {sale.terms?.length > 0 ? <p className="mt-1 text-sm font-medium text-white/80">{sale.terms[0]}</p> : null}
          </div>

          <div className="relative z-10 flex flex-col items-start md:items-end">
            <span className="mb-1 whitespace-nowrap rounded-lg bg-vy-surface px-4 py-1.5 text-lg font-black text-red-600 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]">
              {sale.saleLabel}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/95">
              Ends {new Date(sale.endsAt).toLocaleDateString()}
            </span>
            <span className="mt-2 text-xs font-semibold underline">View all sales</span>
          </div>
        </button>
      ))}
    </section>
  );
}
