import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Heart,
  Home,
  LogOut,
  MapPin,
  Menu,
  PenSquare,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  ThumbsUp,
  Trash2,
  UserCircle2,
  Package,
  X
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { fetchActiveTheme } from "../../features/home/api";
import { applyThemeTokens } from "../../features/home/themeRuntime";
import { Footer } from "./Footer";

const mainNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shops", label: "Shop", icon: Store },
  { to: "/influencer", label: "Influencer", icon: Sparkles }
];

export function AppShell() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const user = useSelector((s) => s.auth.user);
  const cartItemsCount = useSelector((s) => s.cart.items.reduce((acc, item) => acc + item.quantity, 0));

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [search, setSearch] = useState("");

  const menuRef = useRef(null);

  useEffect(() => {
    let mounted = true;
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
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const profileLabel = useMemo(() => {
    if (!isAuthenticated) return "Guest";
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
      ? "bg-[color:var(--vy-primary)] text-white shadow-sm"
      : "text-[color:var(--vy-text)] hover:bg-[color:var(--vy-surface-muted)]"
    }`;

  const profileActionClass =
    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[color:var(--vy-text)] hover:bg-[color:var(--vy-surface-muted)]";

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "var(--vy-bg)", color: "var(--vy-text)" }}>
      <header className="sticky top-0 z-50 border-b border-[color:var(--vy-border)] bg-[color:var(--vy-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--vy-border)] md:hidden"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <Link to="/" className="inline-flex items-center gap-2">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-base font-black text-white shadow-sm"
                style={{ backgroundColor: "var(--vy-primary)" }}
              >
                V
              </span>
              <span className="text-lg font-black tracking-tight">Vyant</span>
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
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--vy-border)] bg-[color:var(--vy-surface)]"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartItemsCount > 0 ? (
                <span
                  className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black text-white"
                  style={{ backgroundColor: "var(--vy-secondary)" }}
                >
                  {cartItemsCount}
                </span>
              ) : null}
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--vy-border)] px-3 py-2 text-sm font-semibold"
              >
                <UserCircle2 size={18} />
                <span className="hidden md:inline">{profileLabel}</span>
              </button>

              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[color:var(--vy-border)] bg-[color:var(--vy-surface)] p-2 shadow-lg">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--vy-muted)]">
                    {profileLabel}
                  </div>
                  <NavLink to="/account/settings" onClick={() => setMenuOpen(false)} className={profileActionClass}>
                    <PenSquare size={15} />
                    Edit Profile
                  </NavLink>
                  <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--vy-muted)]">
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
                  {isAuthenticated ? (
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
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-3 md:px-6">
          <form onSubmit={submitSearch} className="flex items-center gap-2 rounded-xl border border-[color:var(--vy-border)] bg-[color:var(--vy-surface)] px-3 py-2">
            <Search size={16} className="text-[color:var(--vy-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, shops, categories..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--vy-muted)]"
            />
          </form>
        </div>

        {mobileNavOpen ? (
          <div className="border-t border-[color:var(--vy-border)] bg-[color:var(--vy-surface)] px-4 pb-3 pt-2 md:hidden">
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
