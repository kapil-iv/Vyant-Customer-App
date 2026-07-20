import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function PromoCard({ title, subtitle, image, ctaText, ctaLink, bgClass, titleClass, subtitleClass, ctaClass, imageContainerClass }) {
  return (
    <div className={`relative w-full h-[156px] rounded-[12px] overflow-hidden p-5 flex flex-col justify-center border border-vy-border/50 ${bgClass}`}>
      <div className="relative z-10 w-[60%] space-y-1.5">
        <h3 className={`text-[17px] font-extrabold leading-tight ${titleClass}`}>{title}</h3>
        <p className={`text-[11px] leading-relaxed pr-2 ${subtitleClass}`}>{subtitle}</p>
        <Link to={ctaLink} className={`inline-flex items-center gap-1 text-[11px] font-bold ${ctaClass} transition-colors mt-1`}>
          {ctaText} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className={`absolute right-0 top-0 bottom-0 ${imageContainerClass}`}>
        <img src={image} alt={title} className="w-full h-full object-cover object-left" />
      </div>
    </div>
  );
}
