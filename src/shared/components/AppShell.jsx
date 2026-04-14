import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import {
  ChevronDown,
  Heart,
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
  Sparkles,
  Store,
  Sun,
  ThumbsUp,
  Trash2,
  UserCircle2,
  Package,
  X
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { fetchActiveTheme } from "../../features/home/api";
import { applyThemeTokens, getStoredThemeMode, toggleThemeMode as toggleThemeRuntime } from "../../features/home/themeRuntime";
import { Footer } from "./Footer";

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
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(() => getStoredThemeMode());

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

    async function loadActiveTheme() {
      try {
        const activeTheme = await fetchActiveTheme();
        if (!mounted) return;
        applyThemeTokens(activeTheme?.tokens || undefined);
      } catch {
        applyThemeTokens(undefined);
      }
    }

    loadActiveTheme();
    const poll = setInterval(loadActiveTheme, 30000);
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
    <div className="min-h-screen font-sans bg-vy-bg text-vy-text" >
      <header className="sticky top-0 z-50 border-b border-vy-border bg-vy-surface backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-vy-border md:hidden"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <Link to="/" className="inline-flex items-center gap-2">
              <img src={logo} alt="Vyant Logo" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} end={item.to === "/"} className={navLinkClass}>
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}

            <div className="relative" ref={categoriesRef}>
              <button
                type="button"
                onClick={() => setCategoriesMenuOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${categoriesMenuOpen ? "bg-vy-surface-muted text-vy-text" : "text-vy-text hover:bg-vy-surface-muted"}`}
              >
                <Menu size={16} />
                Categories
                <ChevronDown size={14} className={`transition-transform ${categoriesMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {categoriesMenuOpen ? (
                <div className="absolute left-0 mt-2 w-56 rounded-xl border border-vy-border bg-vy-surface p-2 shadow-lg">
                  <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-vy-muted">
                    Products
                  </div>
                  <NavLink to="/products?category=men" onClick={() => setCategoriesMenuOpen(false)} className={profileActionClass}>
                    Men's Collection
                  </NavLink>
                  <NavLink to="/products?category=women" onClick={() => setCategoriesMenuOpen(false)} className={profileActionClass}>
                    Women's Collection
                  </NavLink>
                  <NavLink to="/products?category=kids" onClick={() => setCategoriesMenuOpen(false)} className={profileActionClass}>
                    Kids' Collection
                  </NavLink>
                  <div className="my-1 border-t border-vy-border" />
                  <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-vy-muted">
                    Explore
                  </div>
                  <NavLink to="/shops" onClick={() => setCategoriesMenuOpen(false)} className={profileActionClass}>
                    <Store size={15} />
                    Directory of Shops
                  </NavLink>
                  <NavLink to="/influencer" onClick={() => setCategoriesMenuOpen(false)} className={profileActionClass}>
                    <Sparkles size={15} />
                    Influencers
                  </NavLink>
                </div>
              ) : null}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-vy-border bg-vy-surface text-vy-text hover:bg-vy-surface-muted"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-vy-border bg-vy-surface text-vy-text"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartItemsCount > 0 ? (
                <span
                  className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-gradient px-1 text-[10px] font-black text-white"
                >
                  {cartItemsCount}
                </span>
              ) : null}
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-vy-border px-3 py-2 text-sm font-semibold"
              >
                <UserCircle2 size={18} />
                <span className="hidden md:inline">{profileLabel}</span>
              </button>

              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-vy-border bg-vy-surface p-2 shadow-lg">
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

        <div className="mx-auto max-w-7xl px-4 pb-3 md:px-6">
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
          <div className="border-t border-vy-border bg-vy-surface px-4 pb-3 pt-2 md:hidden">
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

              <div className="mt-2 rounded-xl border border-vy-border bg-vy-surface-muted p-3">
                <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-vy-muted">
                  Categories
                </div>
                <div className="grid gap-1">
                  <NavLink to="/products?category=men" onClick={() => setMobileNavOpen(false)} className={profileActionClass}>Men's Collection</NavLink>
                  <NavLink to="/products?category=women" onClick={() => setMobileNavOpen(false)} className={profileActionClass}>Women's Collection</NavLink>
                  <NavLink to="/products?category=kids" onClick={() => setMobileNavOpen(false)} className={profileActionClass}>Kids' Collection</NavLink>
                </div>
                <div className="my-3 border-t border-vy-border" />
                <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-vy-muted">
                  Explore
                </div>
                <div className="grid gap-1">
                  <NavLink to="/shops" onClick={() => setMobileNavOpen(false)} className={profileActionClass}>
                    <Store size={15} /> Shops
                  </NavLink>
                  <NavLink to="/influencer" onClick={() => setMobileNavOpen(false)} className={profileActionClass}>
                    <Sparkles size={15} /> Influencers
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
