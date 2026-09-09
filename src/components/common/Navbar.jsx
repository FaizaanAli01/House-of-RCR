import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { categories } from '../../data/categories';

const Navbar = () => {
  const { totalItemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchronize mobile menu state on navigation
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setMobileMenuOpen(false);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-brand-dark text-slate-200 text-xs py-2 px-4 text-center font-medium tracking-wide border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
          <span>Free Delivery on orders above ₹999 across India</span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-amber-300">Use coupon <strong className="tracking-wider text-white">RCR10</strong> for extra 10% off</span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 border-b ${
          isScrolled ? 'border-slate-200 shadow-md py-3' : 'border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:text-amber-700 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex flex-col items-center sm:items-start group">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-brand-dark text-amber-400 font-serif font-bold text-base flex items-center justify-center shadow-sm">
                  R
                </span>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-brand-dark uppercase">
                  House of RCR
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold hidden sm:block">
                Premium Indian Fashion
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-md mx-6 relative items-center"
            >
              <input
                type="text"
                placeholder="Search t-shirts, shirts, jeans, hoodies, ethnic wear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-full pl-10 pr-10 py-2.5 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Right Action Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/shop"
                className="hidden lg:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-amber-800 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Shop All
              </Link>

              {/* Shopping Cart Button */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2 p-2.5 rounded-full bg-slate-50 hover:bg-amber-50 text-brand-dark hover:text-amber-800 transition-colors border border-slate-100 group shadow-sm"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-amber-800 transition-colors" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {totalItemsCount}
                  </span>
                )}
                <span className="text-xs font-semibold hidden md:inline mr-1 text-slate-700 group-hover:text-amber-800">
                  Cart
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop Categories Sub-Nav */}
          <nav className="hidden lg:flex items-center justify-center gap-7 pt-3 border-t border-slate-100 mt-3">
            <Link
              to="/shop"
              className="text-xs font-semibold tracking-wider uppercase text-slate-600 hover:text-amber-700 transition-colors py-1"
            >
              All Clothing
            </Link>
            {categories.slice(0, 7).map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="text-xs font-medium tracking-wider uppercase text-slate-600 hover:text-amber-700 transition-colors py-1"
              >
                {cat.name.split('&')[0].trim()}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-white px-4 py-2.5 border-b border-slate-100 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            placeholder="Search t-shirts, shirts, jeans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-10 py-2 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-up">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-brand-dark text-amber-400 font-serif font-bold text-sm flex items-center justify-center">
                  R
                </span>
                <span className="font-serif font-bold text-lg text-brand-dark">
                  HOUSE OF RCR
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Categories
              </div>
              <div className="flex flex-col space-y-1">
                <Link
                  to="/shop"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-900"
                >
                  <span>All Products</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-50/60 text-sm font-medium text-slate-700 hover:text-amber-800"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link
                  to="/cart"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white text-sm font-semibold mb-2"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>View Cart</span>
                  </div>
                  <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-xs">
                    {totalItemsCount}
                  </span>
                </Link>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Original Indian Clothing</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
