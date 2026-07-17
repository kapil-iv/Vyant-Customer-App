import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import influencerGroup from "../../assets/influencer/Container.png";

export function InfluencerBanner() {
  return (
    <section
      className="
        min-h-[130px]
        overflow-hidden
        rounded-2xl
        border
        border-violet-100
        bg-gradient-to-r
        from-[#FAF5FF]
        to-[#EEF2FF]
        px-4
        pt-6
        pb-4
        shadow-[0_2px_12px_rgba(0,0,0,0.05)]
      "
    >
      <div className="flex h-full items-start justify-between gap-4">

        {/* Left */}
        <div className="w-[170px] shrink-0">

          <h3 className="text-[18px] font-bold leading-7 tracking-normal whitespace-nowrap">
            <span className="text-[#111827]">Become an </span>
            <span className="text-[#8B5CF6]">Influencer</span>
          </h3>

          <p className="mt-1 max-w-[174px] text-[11px] leading-[18px] text-[#4B5563]">
            Promote. Earn. Grow with vyant.
          </p>

          <Link
            to="/influencer"
            className="
              mt-4
              inline-flex
              h-9
              items-center
              gap-2
              rounded-full
              bg-[#8B5CF6]
              px-5
              text-[13px]
              font-semibold
              text-white
              shadow-md
              transition-all
              duration-200
              hover:bg-[#7C3AED]
            "
          >
            Join Now
            <ArrowRight size={13} />
          </Link>

        </div>

        {/* Right */}
        <div className="flex items-start pt-1">

          <img
            src={influencerGroup}
            alt="Influencers"
            className="w-[95px] object-contain"
          />

        </div>

      </div>
    </section>
  );
}