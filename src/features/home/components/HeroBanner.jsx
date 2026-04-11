export function HeroBanner({ theme, onExploreSales }) {
  if (!theme) return null;

  const { name, type, tokens, assets, description } = theme;
  const heroImage = assets?.heroImage || assets?.bannerImage || "";
  const bannerImage = assets?.bannerImage || assets?.heroImage || "";

  const containerStyle = {
    backgroundColor: tokens?.background || "#f8fafc",
    color: tokens?.text || "#0f172a"
  };

  const badgeStyle = {
    backgroundColor: tokens?.primary || "#3b82f6",
    color: "#fff"
  };

  const ctaStyle = {
    backgroundColor: tokens?.accent || "#eab308",
    color: tokens?.text || "#0f172a"
  };

  return (
    <section style={containerStyle} className="relative mb-6 overflow-hidden rounded-2xl shadow-sm">
      {heroImage ? (
        <img
          src={heroImage}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          referrerPolicy="no-referrer"
        />
      ) : null}

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 grid min-h-[320px] gap-6 p-8 md:min-h-[420px] md:grid-cols-[1fr_340px] md:p-12">
        <div className="max-w-2xl self-center">
          <span style={badgeStyle} className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
            {type === "festival" ? "Festival Special" : "Special Event"}
          </span>
          <h1 className="mb-4 text-4xl font-black text-white drop-shadow-md md:text-5xl">{name}</h1>
          <p className="mb-8 text-lg text-white/90 drop-shadow md:text-xl">
            {description || "Celebrate the season with exclusive deals and curated collections tailored for you."}
          </p>
          <button
            type="button"
            style={ctaStyle}
            className="rounded-xl px-8 py-3 font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:opacity-90"
            onClick={() => onExploreSales?.()}
          >
            Explore Sales
          </button>
        </div>

        {bannerImage ? (
          <div className="hidden self-end overflow-hidden rounded-xl border border-white/30 bg-white/10 shadow-lg backdrop-blur-sm md:block">
            <img src={bannerImage} alt={`${name} banner`} className="h-48 w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
