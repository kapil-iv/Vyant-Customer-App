import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroSlider({ theme, fallbackImage }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: "slide-1",
      image: theme?.assets?.heroImage || theme?.assets?.bannerImage || fallbackImage || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80",
      title: theme?.name || "Summer Collection 2026",
      description: theme?.description || "Discover the latest trends for the season. Fresh styles added daily.",
      ctaText: "Shop Summer Sales",
      ctaLink: "/sales",
      badge: "New Season"
    },
    {
      id: "slide-2",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80",
      title: "Autumn Essentials",
      description: "Layer up with our premium outerwear and knitwear pieces.",
      ctaText: "View Women's",
      ctaLink: "/products?category=women",
      badge: "Trending"
    },
    {
      id: "slide-3",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80",
      title: "Streetwear Edits",
      description: "Bold looks for the modern streetwear enthusiast. Comfort meets style.",
      ctaText: "Explore Men's",
      ctaLink: "/products?category=men",
      badge: "Featured"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="relative overflow-hidden rounded-[16px] bg-slate-900 shadow-2xl shadow-indigo-200/40">
      <div className="relative flex h-[40vh] min-h-[300px] w-full transition-transform duration-1000 ease-in-out md:h-[70vh]" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative min-w-full h-full flex-shrink-0">
            <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 flex items-center px-6 py-8 md:px-14">
              <div className="max-w-xl space-y-5 text-white">
                <span className="inline-block rounded-full bg-indigo-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-100 border border-indigo-400/30 backdrop-blur-md">
                  {slide.badge}
                </span>
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl drop-shadow-lg">{slide.title}</h1>
                <p className="text-base font-medium text-slate-200/90 md:text-lg leading-relaxed max-w-lg">{slide.description}</p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to={slide.ctaLink} className="vy-primary-btn px-8 py-3.5 text-sm font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30">{slide.ctaText}</Link>
                  <Link to="/products" className="rounded-[12px] border border-white/40 bg-vy-surface/5 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-md transition-all hover:bg-vy-surface/10 hover:border-white/60">All Products</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-black/40 hover:scale-110 md:left-6 group" aria-label="Previous Slide">
        <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-black/40 hover:scale-110 md:right-6 group" aria-label="Next Slide">
        <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === index ? "w-8 bg-vy-surface" : "w-2 bg-vy-surface/40 hover:bg-vy-surface/70"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
