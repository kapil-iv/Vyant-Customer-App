import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

export function DealOfTheDay({ endTime, product }) {
  const [timeLeft, setTimeLeft] = useState({ hours: "08", mins: "24", secs: "16" });

  useEffect(() => {
    if (!endTime) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endTime).getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: "00", mins: "00", secs: "00" });
        return;
      }
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({
        hours: hours.toString().padStart(2, '0'),
        mins: minutes.toString().padStart(2, '0'),
        secs: seconds.toString().padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="w-full rounded-[12px] border border-vy-border bg-white p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-extrabold text-slate-900">Deal of the Day</h3>
        <Link to="/deals" className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-1.5 mb-4">
        <div className="flex flex-col items-center justify-center bg-indigo-500 rounded text-white w-10 h-10">
          <span className="text-sm font-bold leading-none">{timeLeft.hours}</span>
          <span className="text-[8px] uppercase tracking-wider mt-0.5 opacity-90">Hrs</span>
        </div>
        <span className="text-slate-400 font-bold">:</span>
        <div className="flex flex-col items-center justify-center bg-indigo-500 rounded text-white w-10 h-10">
          <span className="text-sm font-bold leading-none">{timeLeft.mins}</span>
          <span className="text-[8px] uppercase tracking-wider mt-0.5 opacity-90">Mins</span>
        </div>
        <span className="text-slate-400 font-bold">:</span>
        <div className="flex flex-col items-center justify-center bg-indigo-500 rounded text-white w-10 h-10">
          <span className="text-sm font-bold leading-none">{timeLeft.secs}</span>
          <span className="text-[8px] uppercase tracking-wider mt-0.5 opacity-90">Secs</span>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative w-full aspect-square rounded-lg bg-[#0d1117] mb-4 overflow-hidden group">
        <span className="absolute top-2 left-2 z-10 bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
          -{product?.discountPercentage || "34"}%
        </span>
        <img 
          src={product?.image} 
          alt={product?.name} 
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" 
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col mb-4">
        <h4 className="text-[13px] font-semibold text-slate-900 mb-1 line-clamp-1">{product?.name || "Sports Sneakers"}</h4>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-extrabold text-indigo-600">₹{product?.price || "2,099"}</span>
          <span className="text-[11px] font-medium text-slate-400 line-through">₹{product?.originalPrice || "3,199"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-bold text-slate-700">{product?.rating || "4.6"}</span>
          <span className="text-[10px] text-slate-400">({product?.reviews || "64"})</span>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors">
        Add to Cart
      </button>
    </div>
  );
}
