import { ShieldCheck, Truck, RefreshCcw, Headphones } from "lucide-react";

export function TrustFeatures() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      subtitle: "100% Safe Transactions",
      iconColor: "text-indigo-600"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      subtitle: "On Time, Every Time",
      iconColor: "text-indigo-600"
    },
    {
      icon: RefreshCcw,
      title: "Easy Returns",
      subtitle: "15 Days Return Policy",
      iconColor: "text-indigo-600"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      subtitle: "We're Here to Help",
      iconColor: "text-indigo-600"
    }
  ];

  return (
    <div className="w-full rounded-[12px] border border-vy-border bg-white p-5 flex flex-col gap-4">
      {features.map((feature, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <feature.icon className={`w-4 h-4 mt-0.5 ${feature.iconColor}`} />
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-slate-900 leading-tight">{feature.title}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">{feature.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
