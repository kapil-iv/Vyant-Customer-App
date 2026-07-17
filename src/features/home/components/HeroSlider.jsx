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
      ctaText: "Shop Now",
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
      ctaText: "Shop Now",
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
        ctaText: "Shop Now",
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
    return "min-h-[225px]";
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
    <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-lg h-[225px] md:h-[304px]">
      <div
        className="relative w-full h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
<div
  className="relative flex w-[708] h-full transition-transform duration-700 ease-out"
  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
>
  {slides.map((slide, idx) => (
    <div
      key={slide.id}
      className="relative min-w-full flex-shrink-0 h-full"
    >
      {/* Banner */}
      <div className="flex h-full w-full overflow-hidden rounded-2xl bg-primary">

        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center w-[42%] md:w-[36%] lg:w-[34%] bg-primary px-7 md:px-10 lg:px-12 py-8 md:py-10 shrink-0">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full border border-[#8B6A46] bg-[#5A432B] px-3 py-1 mb-5 w-fit"
            style={{ backgroundColor: "#5A432B", borderColor: "#8B6A46" }}
          >
            {slide.badgeIcon && (
              <slide.badgeIcon className="w-3 h-3 text-[#FFE6A6]" />
            )}

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFE6A6]">
              {slide.badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[34px] md:text-[48px] lg:text-[56px] font-extrabold leading-[1.05] tracking-[-0.04em] text-white max-w-[280px] mb-6">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-sm md:text-[15px] leading-7 text-white/75 mb-8 max-w-[280px]">
            {slide.description}
          </p>

          {/* CTA */}
          <div className="flex items-center">
            <Link
              to={slide.ctaLink}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white text-black px-6 py-3 h-11 md:h-12 text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-neutral-100"
            >
              {slide.ctaText}

              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex-1 overflow-hidden">

          <picture>
            <source
              media="(max-width:768px)"
              srcSet={slide.mobileImage}
            />

            <img
              src={slide.image}
              alt={slide.title}
              loading={idx === 0 ? "eager" : "lazy"}
              className="absolute inset-0 w-full h-full object-cover object-center md:object-[60%_center]"
            />
          </picture>

          {/* Left Fade */}
          <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-black via-black/70 to-transparent" />

        </div>
      </div>
    </div>
  ))}
</div>

        {/* Desktop Nav Arrows — 56×56 glass per Figma */}
        <button
          onClick={prevSlide}
          className="absolute left-10 top-1/2 -translate-y-1/2 hidden md:flex w-14 h-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 z-10 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex w-14 h-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 z-10 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators — Bottom Center per Figma */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${currentSlide === index ? 'w-5 h-2 bg-indigo-500' : 'w-2 h-2 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
