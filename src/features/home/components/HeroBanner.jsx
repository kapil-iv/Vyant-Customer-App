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
    <section style={containerStyle} className="group relative mb-8 overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Hero Image with Parallax Effect */}
      {heroImage ? (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroImage}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* Animated Overlay Pattern */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        </div>
      ) : (
        <div style={containerStyle} className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Mobile Layout (Stacked) */}
        <div className="block md:hidden">
          <div className="relative min-h-[500px] flex flex-col justify-between p-6">
            {/* Top Section with Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 flex-wrap">
                  <span style={badgeStyle} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    {type === "festival" ? "🎉 Festival Special" : "⚡ Special Event"}
                  </span>
                </div>
              </div>

              {/* Discount Badge for Mobile */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-full px-3 py-1.5 shadow-lg transform rotate-6">
                <span className="text-xs font-black text-white">UP TO 40% OFF</span>
              </div>
            </div>

            {/* Center Content */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow-2xl leading-tight break-words">
                {name?.split(' ').map((word, i) => (
                  <span key={i} className="inline-block animate-slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    {word}{' '}
                  </span>
                ))}
              </h1>

              <p className="text-base text-white/90 leading-relaxed drop-shadow">
                {description || "Celebrate the season with exclusive deals and curated collections tailored for you."}
              </p>

              {/* Features Grid for Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex-wrap">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-white">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex-wrap">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-xs text-white">30-Day Returns</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              style={ctaStyle}
              className="relative overflow-hidden rounded-full px-6 py-3.5 font-bold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group/btn"
              onClick={() => onExploreSales?.()}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                Explore Sales
                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
            </button>
          </div>
        </div>

        {/* Desktop Layout (Side by Side) */}
        <div className="hidden md:grid md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_420px] gap-8 p-8 lg:p-12 min-h-[480px] lg:min-h-[520px]">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Badge with Icon */}
            <div className="flex items-center gap-3">
              <span style={badgeStyle} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                {type === "festival" ? "🎊 Festival Special" : "🔥 Limited Time Offer"}
              </span>

              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-white">4.8 ★ (2k+ reviews)</span>
              </div>
            </div>

            {/* Animated Title */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white drop-shadow-2xl leading-tight">
              {name?.split(' ').map((word, i) => (
                <span
                  key={i}
                  className="inline-block hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-white hover:to-white/70 transition-all duration-300 cursor-default"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {word}{' '}
                </span>
              ))}
            </h1>

            {/* Description with gradient text */}
            <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-xl drop-shadow">
              {description || "Celebrate the season with exclusive deals and curated collections tailored for you."}
            </p>

            {/* Benefits Row */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-white">Free Shipping Worldwide</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-white">24/7 Customer Support</span>
              </div>
            </div>

            {/* CTA Buttons Group */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                style={ctaStyle}
                className="group relative overflow-hidden rounded-full px-8 py-3.5 font-bold shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
                onClick={() => onExploreSales?.()}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Sales
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>

              <button
                type="button"
                className="relative overflow-hidden rounded-full border-2 border-white/30 bg-white/10 px-8 py-3.5 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:-translate-y-1 active:translate-y-0"
                onClick={() => window.location.href = '/collections'}
              >
                View Collections
              </button>
            </div>
          </div>

          {/* Right Image Card */}
          {bannerImage ? (
            <div className="flex items-end">
              <div className="relative w-full overflow-hidden rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl group/card">
                <img
                  src={bannerImage}
                  alt={`${name} banner`}
                  className="h-64 w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                {/* Floating Badge on Image */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 transform rotate-12">
                  <span className="text-xs font-bold text-white">Limited Stock!</span>
                </div>

                {/* Hover Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover/card:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-bold">Shop Now →</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-end">
              <div className="w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-white/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-white/60 text-sm">Premium Collection</p>
                <p className="text-white font-bold mt-2">Coming Soon</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden md:block animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}

// Add these animations to your global CSS:
/*
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scrollDown {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
}

.animate-scroll-down {
  animation: scrollDown 1.5s ease-in-out infinite;
}
*/