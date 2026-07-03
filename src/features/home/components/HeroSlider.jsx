import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";

export function HeroSlider({ theme, fallbackImage }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const slides = [
    {
      id: "slide-1",
      image: theme?.assets?.heroImage || theme?.assets?.bannerImage || fallbackImage || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80",
      mobileImage: theme?.assets?.mobileHeroImage || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800",
      title: theme?.name || "Summer Collection 2026",
      description: theme?.description || "Discover the latest trends for the season. Fresh styles added daily.",
      ctaText: "Shop Summer Sales",
      ctaLink: "/sales",
      badge: "New Season",
      badgeIcon: Sparkles,
      color: "from-amber-500/20 to-orange-500/20"
    },
    {
      id: "slide-2",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80",
      mobileImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800",
      title: "Autumn Essentials",
      description: "Layer up with our premium outerwear and knitwear pieces.",
      ctaText: "View Women's",
      ctaLink: "/products?category=women",
      badge: "Trending",
      badgeIcon: TrendingUp,
      color: "from-red-500/20 to-rose-500/20"
    },
    {
        id: "slide-3",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80",
        mobileImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
        title: "Streetwear Edits",
        description: "Bold looks for the modern streetwear enthusiast. Comfort meets style.",
        ctaText: "Explore Men's",
        ctaLink: "/products?category=men",
        badge: "Featured",
        badgeIcon: ShoppingBag,
        color: "from-purple-500/20 to-pink-500/20"
      },
  ];

  const getMobileHeight = () => {
    const slide = slides[currentSlide];
    const titleLength = slide?.title?.length || 0;
    const descLength = slide?.description?.length || 0;
    if (titleLength > 40 || descLength > 120) return "min-h-[600px]";
    return "min-h-[500px]";
  };

  const goToSlide = (index) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const nextSlide = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isAnimating, slides.length]);

  const prevSlide = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isAnimating, slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isAnimating, nextSlide]);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) nextSlide();
    if (touchStart - touchEnd < -50) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-[24px] bg-slate-900 shadow-2xl w-full">
      <div
        className="relative w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative flex w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={slide.id} className="relative min-w-full flex-shrink-0">
              <div className={`${isMobile ? getMobileHeight() : 'h-[85vh] lg:h-[90vh]'} w-full relative`}>
                <picture>
                  <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </picture>

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/90 md:via-black/40 md:to-transparent" />

                {/* Fixed Content Container */}
                <div className="absolute inset-0 flex items-end md:items-center px-5 py-12 md:px-16 lg:px-24">
                  <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl space-y-4 md:space-y-6 text-white">
                    {/* Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${slide.color} backdrop-blur-md px-3 py-1 border border-white/20`}>
                        {slide.badgeIcon && <slide.badgeIcon className="w-3.5 h-3.5 text-indigo-300" />}
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{slide.badge}</span>
                      </div>
                    </div>

                    {/* Title - Fixed width and wrapping */}
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter whitespace-normal break-words">
                      {slide.title}
                    </h1>

                    {/* Description - Fixed width */}
                    <p className="text-sm md:text-lg lg:text-xl text-white/80 leading-relaxed max-w-[280px] sm:max-w-md md:max-w-xl line-clamp-3 md:line-clamp-none">
                      {slide.description}
                    </p>

                    {/* CTA Buttons - Stacked on tiny screens */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                      <Link
                        to={slide.ctaLink}
                        className="group relative overflow-hidden rounded-full bg-indigo-600 px-6 py-3 text-sm md:text-base font-bold uppercase text-white transition-all text-center sm:w-auto"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {slide.ctaText}
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>

                      <Link
                        to="/products"
                        className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm md:text-base font-bold uppercase text-white backdrop-blur-sm transition-all text-center sm:w-auto hover:bg-white/20"
                      >
                        All Products
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Nav */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex rounded-full bg-black/30 backdrop-blur-md p-3 text-white hover:bg-black/50 z-10"><ChevronLeft /></button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex rounded-full bg-black/30 backdrop-blur-md p-3 text-white hover:bg-black/50 z-10"><ChevronRight /></button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full h-1.5 ${currentSlide === index ? 'w-8 bg-indigo-500' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
