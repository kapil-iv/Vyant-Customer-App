import { promoCards } from '../data/sidebarData';
import { PromoCard } from '../../../components/common/PromoCard';
import { DealOfTheDay } from './DealOfTheDay';
import { TrustFeatures } from './TrustFeatures';
import sneakersImg from '../../../assets/Sidebar/Sports Sneakers.png';

export function HomeSidebar() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dealProduct = {
    name: "Sports Sneakers",
    price: "2,099",
    originalPrice: "3,199",
    discountPercentage: "34",
    rating: "4.6",
    reviews: "64",
    image: sneakersImg
  };

  return (
    <aside className="w-full flex flex-col gap-6">
      {/* Promo Cards */}
      <div className="flex flex-col gap-6">
        {promoCards.map((promo) => (
          <PromoCard key={promo.id} {...promo} />
        ))}
      </div>

      {/* Deal of the Day */}
      <DealOfTheDay endTime={tomorrow.toISOString()} product={dealProduct} />

      {/* Trust Features */}
      <TrustFeatures />
    </aside>
  );
}
