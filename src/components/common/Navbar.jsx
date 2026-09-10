import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  X,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Package,
  Loader2,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'T-Shirts', value: 'tshirts' },
  { label: 'Shirts', value: 'shirts' },
  { label: 'Jeans', value: 'jeans' },
  { label: 'Trousers', value: 'trousers' },
  { label: 'Hoodies', value: 'hoodies' },
  { label: 'Jackets', value: 'jackets' },
  { label: 'Dresses', value: 'dresses' },
  { label: 'Ethnic Wear', value: 'ethnic' },
  { label: 'Accessories', value: 'accessories' },
];

const Navbar = () => {
  const { totalItemsCount } = useCart();
  const { user, isAuthenticated, authLoading, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const catRef = useRef(null);
  const userRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target))
        setShowCatDropdown(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setShowUserDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    setShowUserDropdown(false);
    try {
      await logout();
      addToast('Logged out successfully.', 'info');
      navigate('/');
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-cream/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <span className="w-8 h-8 rounded-xl bg-brand-dark text-amber-400 font-serif font-bold text-base flex items-center justify-center shadow">
              R
            </span>
            <span className="font-serif text-base sm:text-lg font-bold tracking-wider text-brand-dark uppercase hidden xs:block">
              House of RCR
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? 'text-amber-700' : 'hover:text-slate-900 transition-colors'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive ? 'text-amber-700' : 'hover:text-slate-900 transition-colors'
              }
            >
              Shop
            </NavLink>

            {/* Categories Dropdown */}
            <div ref={catRef} className="relative">
              <button
                onClick={() => setShowCatDropdown(!showCatDropdown)}
                className="flex items-center gap-1 hover:text-slate-900 transition-colors"
              >
                Categories <ChevronDown className="w-3 h-3" />
              </button>
              {showCatDropdown && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-50">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.value}
                      to={`/shop?category=${cat.value}`}
                      onClick={() => setShowCatDropdown(false)}
                      className="block px-4 py-2 text-xs font-semibold text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            {showSearch ? (
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm"
                ref={searchRef}
              >
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clothing..."
                  className="text-sm outline-none bg-transparent w-36 sm:w-48 text-slate-900 placeholder:text-slate-400"
                />
                <button type="submit" className="text-slate-500 hover:text-amber-700 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-xl text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-all"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-all"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[1.1rem] min-h-[1.1rem] rounded-full flex items-center justify-center leading-none px-0.5">
                  {totalItemsCount > 99 ? '99+' : totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {authLoading ? (
              <div className="p-2">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : isAuthenticated ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-amber-50 transition-all group"
                  aria-label="Account menu"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
                    <span className="text-amber-800 font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-slate-700 group-hover:text-amber-800 max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {showUserDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" /> My Profile
                    </Link>
                    <Link
                      to="/account"
                      state={{ tab: 'orders' }}
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      <Package className="w-3.5 h-3.5" /> My Orders
                    </Link>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-60"
                      >
                        {logoutLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <LogOut className="w-3.5 h-3.5" />
                        )}
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-600 hover:text-amber-800 px-3 py-2 rounded-xl hover:bg-amber-50 transition-all uppercase tracking-wide"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold text-white bg-brand-dark hover:bg-black px-4 py-2 rounded-xl transition-all uppercase tracking-wide shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-4 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
            >
              Shop
            </Link>
            <div className="pt-1 pb-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.value}
                    to={`/shop?category=${cat.value}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 mt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                  >
                    <User className="w-4 h-4" /> My Account
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
