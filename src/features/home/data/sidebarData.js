import modelsImg from '../../../assets/Sidebar/Models.png';
import shoppingBagsImg from '../../../assets/Sidebar/Shopping Bags.png';

export const promoCards = [
  {
    id: 1,
    title: "New Arrivals",
    subtitle: "Fresh Styles Just Dropped!",
    image: modelsImg,
    ctaText: "Explore Now",
    ctaLink: "/products?sort=new",
    bgClass: "bg-[#0b101e] text-white",
    titleClass: "text-white",
    subtitleClass: "text-slate-400",
    ctaClass: "text-indigo-400 hover:text-indigo-300",
    imageContainerClass: "w-[55%] bg-[#0b101e]"
  },
  {
    id: 2,
    title: "Min. 50% OFF",
    subtitle: "On Top Fashion Brands",
    image: shoppingBagsImg,
    ctaText: "Shop Now",
    ctaLink: "/sales",
    bgClass: "bg-red-50/50 text-slate-900",
    titleClass: "text-slate-900",
    subtitleClass: "text-slate-500",
    ctaClass: "text-indigo-600 hover:text-indigo-700",
    imageContainerClass: "w-[45%] bg-[#991b1b]" 
  }
];
