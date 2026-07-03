import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ArrowUp,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Building,
  Store,
  Heart
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-gray-950 text-white pt-16 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1: Brand & Story */}
          <div className="space-y-6">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-lg font-black text-white shadow-sm">
                  V
                </span>
                <span className="text-2xl font-black tracking-tight text-white">Vyant</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Redefining <strong>Bikaner Fashion</strong> by blending our rich local heritage with modern <strong>Influencer Collections</strong>. We are your bridge to a <strong>Local Connect</strong>, bringing authentic styles directly to you.
              </p>
            </div>

            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-orange-500 transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="hover:text-orange-500 transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="hover:text-orange-500 transition-colors" aria-label="X (Twitter)"><Twitter size={20} /></a>
              <a href="#" className="hover:text-orange-500 transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={16} className="text-green-500" />
                <span>100% Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle size={16} className="text-blue-500" />
                <span>Verified Local Stores</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation - Shop */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/products?category=men" className="hover:text-orange-500 transition-colors">Men</Link></li>
              <li><Link to="/products?category=women" className="hover:text-orange-500 transition-colors">Women</Link></li>
              <li><Link to="/products?category=kids" className="hover:text-orange-500 transition-colors">Kids</Link></li>
              <li><Link to="/products?category=accessories" className="hover:text-orange-500 transition-colors">Accessories</Link></li>
              <li><Link to="/products?category=perfumes" className="hover:text-orange-500 transition-colors">Perfumes</Link></li>
            </ul>
          </div>

          {/* Column 3: Navigation - Support & Company */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-10 lg:gap-8">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
                <li><Link to="/track-order" className="hover:text-orange-500 transition-colors">Track Order</Link></li>
                <li><Link to="/shipping-policy" className="hover:text-orange-500 transition-colors">Shipping Policy</Link></li>
                <li><Link to="/return-refund" className="hover:text-orange-500 transition-colors">Return & Refund</Link></li>
              </ul>
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg mb-4 text-white">Company</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
                <li><Link to="/career" className="hover:text-orange-500 transition-colors">Career</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-conditions" className="hover:text-orange-500 transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter & Admin Links */}
          <div className="text-sm">
            <h3 className="font-bold text-lg mb-4 text-white">Stay in Style</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex w-full mb-8" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white rounded-l-lg border border-gray-700 px-4 py-2 w-full focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-500"
                required
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2 rounded-r-lg font-semibold transition-colors whitespace-nowrap"
              >
                Join
              </button>
            </form>

            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Partner With Us</h4>
              <Link to="/become-seller" className="flex items-center gap-2 text-orange-500 hover:text-orange-400 font-semibold transition-colors">
                <Store size={14} /> Become a Seller
              </Link>
              <Link to="/partner/store-login" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Store size={14} /> Store Login
              </Link>
              <Link to="/influencer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Building size={14} /> Influencer Portal
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-gray-500 text-sm">
            <span>© 2026 Vyant. All Rights Reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="inline-flex items-center gap-1 font-medium bg-gray-800/50 px-2.5 py-1 rounded-full text-gray-400 border border-gray-700/50">
              Made with <Heart size={10} className="fill-red-500 text-red-500 mx-0.5" /> in Bikaner
            </span>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-4 text-gray-400 opacity-60">
            <div className="font-bold italic text-sm tracking-wider" aria-label="Visa">VISA</div>
            <div className="font-bold text-xs tracking-wider flex items-center -space-x-1" aria-label="Mastercard">
              <div className="w-4 h-4 rounded-full bg-red-500 mix-blend-color-dodge opacity-80 z-10"></div>
              <div className="w-4 h-4 rounded-full bg-yellow-500 mix-blend-color-dodge opacity-80"></div>
            </div>
            <div className="font-bold text-xs border border-current px-1.5 py-0.5 rounded uppercase" aria-label="UPI">UPI</div>
            <CreditCard size={18} />
          </div>
        </div>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="mx-auto mt-10 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-white transition-colors pb-2 group"
        >
          <span>Back to Top</span>
          <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </footer>
  );
}
