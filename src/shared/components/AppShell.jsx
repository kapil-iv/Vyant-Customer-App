import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo2 from "../../assets/logo2.png";
import {
  ChevronDown,
  Heart,
  Bell,
  Home,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Moon,
  PenSquare,
  Plus,
  Search,
  ShoppingCart,
  ShoppingBag,
  Sparkles,
  Store,
  Sun,
  LayoutGrid,
  ThumbsUp,
  Trash2,
  UserCircle2,
  Package,
  X
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { fetchActiveTheme, fetchCategories } from "../../features/home/api";
import { applyThemeTokens, getStoredThemeMode, toggleThemeMode as toggleThemeRuntime } from "../../features/home/themeRuntime";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

const mainNav = [
  { to: "/", label: "Home", icon: Home }
];

export function AppShell() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const user = useSelector((s) => s.auth.user);
  const cartItemsCount = useSelector((s) => s.cart.items.reduce((acc, item) => acc + item.quantity, 0));

  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(() => getStoredThemeMode());
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  

  const menuRef = useRef(null);
  const categoriesRef = useRef(null);

  const toggleTheme = () => {
    const nextTheme = toggleThemeRuntime();
    setTheme(nextTheme);
  };

  useEffect(() => {
    let mounted = true;

    // Explicitly sync tailwind CSS dark mode class with the application's runtime mode on fast loads
    if (getStoredThemeMode() === "dark") document.documentElement.classList.add("dark");

    async function loadInitialData() {
      try {
        setCategoriesLoading(true);
        const [activeTheme, cats] = await Promise.all([fetchActiveTheme(), fetchCategories()]);
        if (!mounted) return;
        applyThemeTokens(activeTheme?.tokens || undefined);
        setCategories(cats || []);
      } catch {
        applyThemeTokens(undefined);
      } finally {
        if (mounted) setCategoriesLoading(false);
      }
    }

    loadInitialData();
    const poll = setInterval(async () => {
      const activeTheme = await fetchActiveTheme();
      if (mounted) applyThemeTokens(activeTheme?.tokens || undefined);
    }, 30000);
    return () => {
      mounted = false;
      clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    const onDocClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const profileLabel = useMemo(() => {
    if (!isAuthenticated) return "Login";
    return user?.name || "My Profile";
  }, [isAuthenticated, user?.name]);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    setMobileNavOpen(false);
    navigate(`/products${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isActive
      ? "bg-primary-gradient text-white shadow-sm"
      : "text-vy-text hover:bg-vy-surface-muted"
    }`;

  const profileActionClass =
    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-vy-text hover:bg-vy-surface-muted";

  return (
  <div className="min-h-screen font-sans bg-vy-bg text-vy-text">
  
  {/* Tier 1: Top Announcement Bar */}
  {/* <div className="hidden md:flex justify-between items-center bg-indigo-600 text-white px-6 py-2 text-xs font-medium">
    <span>Summer Sale is Live! Up to 50% OFF on 1000+ Styles. <Link to="/products" className="underline font-bold ml-1">Shop Now &rarr;</Link></span>
    <div className="flex gap-4">
      <span className="cursor-pointer">Download App</span>
      <span className="cursor-pointer">Sell on VYANT</span>
      <span className="cursor-pointer">Track Order</span>
      <span className="cursor-pointer">Help & Support</span>
    </div>
  </div> */}

 {/* Main Header Wrapper aligned to Figma Design */}
<header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
  
  {/* Figma Row 1: Logo | Search | Actions */}
  <div className="mx-auto max-w-[1400px] relative flex items-center justify-between px-4 md:px-6 py-3">
    
    {/* Left side: Logo + Search */}
    <div className="flex items-center gap-8 flex-1 max-w-4xl">
      {/* Left: Logo container */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 md:hidden text-gray-700 dark:text-gray-300"
          onClick={() => setMobileNavOpen((prev) => !prev)}
        >
          {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* FIXED: Mobile par screen ke absolute center me rahega aur desktop (md) par wapas grid me normal left-aligned ho jayega */}
        <Link 
          to="/" 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:transform-none flex items-center gap-2"
        >
          <img src={logo2} alt="Vyant Logo" className="h-10 w-auto object-contain rounded" />

          {/* FIXED: 'hidden sm:block' hata diya taaki mobile par bhi logo ke sath name right side me dikhe */}
          <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent italic drop-shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
  VYANT
</span>
        </Link>
      </div>

        {/* Middle: Desktop Search Bar */}
        <div className="hidden lg:flex flex-1">
        <form onSubmit={submitSearch} className="flex w-full items-center border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500/20 overflow-hidden">
          <div className="flex items-center pl-3 pr-2 text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for clothes, brands & more..." 
            className="w-full bg-transparent text-sm outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 py-2.5"
          />


          {/* <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700 mx-2" />
          <div className="relative flex items-center">
            <select className="bg-transparent text-sm text-gray-600 dark:text-gray-300 outline-none cursor-pointer py-2.5 pl-2 pr-6 appearance-none">
              <option>All Categories</option>
              {!categoriesLoading && categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 text-gray-400 pointer-events-none" />
          </div> */}
          
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-6 py-2.5 flex items-center justify-center self-stretch">
            <Search size={18} />
          </button>
        </form>
      </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 flex-shrink-0">
        
        {/* Location & Language */}
        {/* <div className="hidden xl:flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
            <MapPin size={16} className="text-gray-500" />
            <span>Bikaner</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
            <span className="text-lg">🌐</span>
            <span>English</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div> */}

        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-3">
          
          <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          {/* <button className="relative flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition hidden md:flex">
            <div className="relative">
             
               <Bell size={20} />

              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border border-white">1</span>
            </div>
            <span className="text-[10px] mt-1 font-medium">Notifications</span>
          </button> */}
          
          {/* Wishlist */}
          <Link to="/wishlist" className="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition hidden md:flex">
            <Heart size={20} />
            <span className="text-[10px] mt-1 font-medium">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition relative">
            <div className="relative">
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white border border-white">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium hidden md:block">Cart</span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative ml-1 pl-1 sm:ml-3 sm:pl-3 border-l border-gray-200 dark:border-gray-700 hidden md:block" ref={menuRef}>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-left"
            >
              <div className="h-9 w-9 rounded-full bg-gray-800 text-white flex items-center justify-center overflow-hidden flex-shrink-0">
                <UserCircle2 size={36} className="text-gray-300" strokeWidth={1.5} />
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {profileLabel} <ChevronDown size={14} className="text-gray-500" />
                </div>
                <div className="text-[11px] text-indigo-600 font-medium">Premium User</div>
              </div>
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-3 w-64 rounded-xl border border-vy-border bg-vy-surface p-2 shadow-xl z-50">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-vy-muted">
                  {profileLabel}
                </div>
                {isAuthenticated ? (
                  <>
                    <NavLink to="/account/settings" onClick={() => setMenuOpen(false)} className={profileActionClass}>
                      <PenSquare size={15} />
                      Edit Profile
                    </NavLink>
                    <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-vy-muted">
                      Address Management
                    </div>
                    <NavLink to="/account/addresses?action=add" onClick={() => setMenuOpen(false)} className={profileActionClass}>
                      <MapPin size={15} />
                      <Plus size={13} />
                      Add Address
                    </NavLink>
                    <NavLink to="/account/addresses?action=remove" onClick={() => setMenuOpen(false)} className={profileActionClass}>
                      <MapPin size={15} />
                      <Trash2 size={13} />
                      Remove Address
                    </NavLink>
                    <NavLink to="/orders" onClick={() => setMenuOpen(false)} className={profileActionClass}>
                      <Package size={15} />
                      My Orders
                    </NavLink>
                    <NavLink to="/wishlist" onClick={() => setMenuOpen(false)} className={profileActionClass}>
                      <Heart size={15} />
                      Wishlist
                    </NavLink>
                    <NavLink to="/wishlist?view=liked" onClick={() => setMenuOpen(false)} className={profileActionClass}>
                      <ThumbsUp size={15} />
                      Liked Products
                    </NavLink>
                    <button
                      type="button"
                      className={`${profileActionClass} text-rose-700`}
                      onClick={() => {
                        dispatch(logout());
                        setMenuOpen(false);
                        navigate("/");
                      }}
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" onClick={() => setMenuOpen(false)} className={profileActionClass}>
                      <LogIn size={15} />
                      Login
                    </NavLink>
                    <NavLink to="/register" onClick={() => setMenuOpen(false)} className={profileActionClass}>
                      <UserCircle2 size={15} />
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </div>

    {/* Figma Row 2: Secondary Categories Link Bar */}
    {/* <div className="hidden md:block border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="mx-auto max-w-[1400px] flex items-center gap-6 px-6 h-12 text-sm font-medium text-gray-700 dark:text-gray-300"> */}
        
        {/* Categories trigger */}
        {/* <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100 pr-6 border-r border-gray-200 dark:border-gray-700 cursor-pointer hover:text-indigo-600 transition-colors">
          <Menu size={18} /> Categories <ChevronDown size={14} className="text-gray-400" />
        </div> */}
        
        {/* Links */}
        {/* <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar flex-1 whitespace-nowrap">
          {categoriesLoading ? (
            <span className="text-xs animate-pulse text-gray-400">Loading Categories...</span>
          ) : (
            (categories.length > 0 ? categories : ["Men", "Women", "Kids", "Handcrafted", "Footwear", "Accessories", "Beauty", "Offers", "New Arrivals", "Brands"]).map((cat) => (
              <Link 
                key={cat} 
                to={`/products?category=${cat}`} 
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {cat}
              </Link>
            ))
          )}
        </div> */}
      {/* </div>
    </div> */}

        <div className="mx-auto max-w-7xl px-4 pb-3 md:hidden">
          <form onSubmit={submitSearch} className="flex items-center gap-2 rounded-xl border border-vy-border bg-vy-surface px-3 py-2">
            <Search size={16} className="text-vy-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, shops, categories..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-vy-muted"
            />
          </form>
        </div>

        {mobileNavOpen ? (
          <div className="max-h-[70vh] overflow-y-auto border-t border-vy-border bg-vy-surface px-4 pb-3 pt-2 md:hidden">
            <div className="grid gap-2">
              {mainNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={navLinkClass}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}

              <button
                type="button"
                onClick={() => setMobileExploreOpen((prev) => !prev)}
                className="flex items-center justify-between rounded-xl border border-vy-border bg-vy-surface-muted px-3 py-2 text-sm font-semibold"
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles size={15} />
                  Explore
                </span>
                <ChevronDown size={15} className={`transition-transform ${mobileExploreOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileExploreOpen ? (
                <div className="rounded-xl border border-vy-border bg-vy-surface-muted p-3">
                  <div className="grid gap-1">
                    <NavLink to="/shops" onClick={() => setMobileNavOpen(false)} className={profileActionClass}>
                      <Store size={15} /> Shops
                    </NavLink>
                    <NavLink to="/influencer" onClick={() => setMobileNavOpen(false)} className={profileActionClass}>
                      <Sparkles size={15} /> Influencers
                    </NavLink>
                  </div>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setMobileCategoryOpen((prev) => !prev)}
                className="flex items-center justify-between rounded-xl border border-vy-border bg-vy-surface-muted px-3 py-2 text-sm font-semibold"
              >
                <span className="inline-flex items-center gap-2">
                  <Menu size={15} />
                  Category
                </span>
                <ChevronDown size={15} className={`transition-transform ${mobileCategoryOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileCategoryOpen ? (
                <div className="rounded-xl border border-vy-border bg-vy-surface-muted p-3">
                  {/* <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-vy-muted">
                    Categories
                  </div> */}
                  <div className="grid gap-1">
                    {categoriesLoading ? (
                      <div className="px-3 py-2 text-xs text-vy-muted animate-pulse">Loading...</div>
                    ) : (
                      categories.map(cat => (
                        <NavLink key={cat} to={`/products?category=${cat}`} onClick={() => setMobileNavOpen(false)} className={profileActionClass}>
                          <span className="capitalize">{cat}</span> Collection
                        </NavLink>
                      ))
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>
      

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
     <div className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 md:hidden border-t transition-colors duration-200 bg-white border-gray-200 text-gray-600 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400">
  
  {/* Home */}
  <Link to="/" className="flex flex-col items-center hover:text-indigo-500 dark:hover:text-indigo-400">
    <Home size={24} />
    <span className="text-xs">Home</span>
  </Link>
  
  {/* Category */}
  <Link to="/products" className="flex flex-col items-center hover:text-indigo-500 dark:hover:text-indigo-400">
    <LayoutGrid size={24}/>
    <span className="text-xs">Categories</span>
  </Link>
  
  {/* Central Vyant Button */}
  <div className="relative w-16 h-full flex flex-col items-center justify-end">
    <button className="absolute -top-7 flex flex-col items-center group transition-transform duration-200 hover:scale-105 active:scale-95">
      {/* Dynamic Background Wrapper for the Cutout */}
      <div className="p-1 bg-white dark:bg-gray-900 rounded-full shadow-md border border-gray-100 dark:border-gray-800">
        <img
          src="logo.jpeg"
          className="h-12 w-12 object-cover rounded-full select-none pointer-events-none"
          alt="Vyant Logo"
        />
      </div>
      {/* FIXED: text-gray-800 ko dark mode ke liye text-gray-200 diya hai */}
      <span className="text-xs font-semibold mt-1 text-gray-800 dark:text-gray-300 transition-colors duration-200">
        Vyant
      </span>
    </button>
  </div>
     
  {/* Order */}
  <Link to="/orders" className="flex flex-col items-center hover:text-indigo-500 dark:hover:text-indigo-400">
    <ShoppingBag size={24}/>
    <span className="text-xs">Order</span>
  </Link>
  
  {/* Profile */}
  <Link to="/account/settings" className="flex flex-col items-center hover:text-indigo-500 dark:hover:text-indigo-400">
    <UserCircle2 size={24} />
    <span className="text-xs">Profile</span>
  </Link>

  
  


</div>
</div>
  );
}
