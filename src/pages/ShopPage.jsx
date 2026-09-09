import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronRight, X, Loader2 } from 'lucide-react';
import FilterSidebar from '../components/shop/FilterSidebar';
import SortDropdown from '../components/shop/SortDropdown';
import ProductGrid from '../components/shop/ProductGrid';
import { categories } from '../data/categories';
import { fetchProducts } from '../services/api';

const MAX_PRICE = 5000;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const querySearch = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const onlyDeals = searchParams.get('filter') === 'deals';
  const onlyNewArrivals = searchParams.get('filter') === 'new';

  const [priceRange, setPriceRange] = useState(MAX_PRICE);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const setSelectedCategory = (cat) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (cat && cat !== 'all') {
        next.set('category', cat);
      } else {
        next.delete('category');
      }
      return next;
    });
  };

  const setOnlyDeals = (val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) {
        next.set('filter', 'deals');
      } else if (next.get('filter') === 'deals') {
        next.delete('filter');
      }
      return next;
    });
  };

  const setOnlyNewArrivals = (val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) {
        next.set('filter', 'new');
      } else if (next.get('filter') === 'new') {
        next.delete('filter');
      }
      return next;
    });
  };

  // Load products from API whenever filters/search/sort change
  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {
          search: querySearch,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          maxPrice: priceRange < MAX_PRICE ? priceRange : undefined,
          minRating: minRating > 0 ? minRating : undefined,
          deals: onlyDeals ? 'true' : undefined,
          newArrivals: onlyNewArrivals ? 'true' : undefined,
          sort: sortBy,
        };

        if (selectedBrands.length > 0) {
          params.brand = selectedBrands.join(',');
        }

        const data = await fetchProducts(params);
        if (isMounted) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Error loading shop products from API:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [
    querySearch,
    selectedCategory,
    priceRange,
    selectedBrands,
    minRating,
    onlyDeals,
    onlyNewArrivals,
    sortBy,
  ]);

  const brandsList = useMemo(() => {
    return ['House of RCR', 'House of RCR Ethnic', 'House of RCR Atelier'];
  }, []);

  const handleResetFilters = () => {
    setPriceRange(MAX_PRICE);
    setSelectedBrands([]);
    setMinRating(0);
    setSortBy('featured');
    setSearchParams({});
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (priceRange < MAX_PRICE ? 1 : 0) +
    selectedBrands.length +
    (minRating > 0 ? 1 : 0) +
    (onlyDeals ? 1 : 0) +
    (onlyNewArrivals ? 1 : 0) +
    (querySearch ? 1 : 0);

  const activeCategoryObject = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="bg-brand-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-amber-800 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">
            {activeCategoryObject ? activeCategoryObject.name : 'All Clothing'}
          </span>
        </nav>

        {/* Page Banner Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              House of RCR Fashion
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
              {querySearch
                ? `Search results for "${querySearch}"`
                : activeCategoryObject
                ? activeCategoryObject.name
                : 'All Clothing & Styles'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {activeCategoryObject
                ? activeCategoryObject.description
                : 'Explore our latest collection of quality t-shirts, formal & casual shirts, comfortable jeans, stylish jackets, and festive ethnic wear.'}
            </p>
          </div>
        </div>

        {/* Mobile Filter Trigger */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-800 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-amber-500 text-slate-950 rounded-full text-[11px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Active Filters:
            </span>

            {querySearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/70 border border-amber-300 text-amber-900 rounded-full text-xs font-medium">
                <span>Search: "{querySearch}"</span>
                <button onClick={() => setSearchParams({})} className="hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-medium">
                <span>{activeCategoryObject?.name}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:text-amber-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {priceRange < MAX_PRICE && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-medium">
                <span>Under ₹{priceRange.toLocaleString('en-IN')}</span>
                <button onClick={() => setPriceRange(MAX_PRICE)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-xs font-medium">
                <span>{minRating}★ & above</span>
                <button onClick={() => setMinRating(0)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onlyDeals && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 border border-rose-300 text-rose-800 rounded-full text-xs font-medium">
                <span>Offers & Deals</span>
                <button onClick={() => setOnlyDeals(false)} className="hover:text-rose-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onlyNewArrivals && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-xs font-medium">
                <span>New Arrivals</span>
                <button onClick={() => setOnlyNewArrivals(false)} className="hover:text-emerald-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm h-fit sticky top-28">
            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              minRating={minRating}
              setMinRating={setMinRating}
              onlyDeals={onlyDeals}
              setOnlyDeals={setOnlyDeals}
              onlyNewArrivals={onlyNewArrivals}
              setOnlyNewArrivals={setOnlyNewArrivals}
              onResetFilters={handleResetFilters}
              brandsList={brandsList}
              maxPriceLimit={MAX_PRICE}
            />
          </aside>

          {/* Product Listing Area */}
          <main className="lg:col-span-3 space-y-6">
            <SortDropdown
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalResults={products.length}
            />

            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Loader2 className="w-9 h-9 animate-spin text-amber-600" />
                <span className="text-sm font-medium">Fetching catalog from database...</span>
              </div>
            ) : (
              <ProductGrid
                products={products}
                viewMode={viewMode}
                onResetFilters={handleResetFilters}
              />
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-up p-6 overflow-y-auto">
            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              minRating={minRating}
              setMinRating={setMinRating}
              onlyDeals={onlyDeals}
              setOnlyDeals={setOnlyDeals}
              onlyNewArrivals={onlyNewArrivals}
              setOnlyNewArrivals={setOnlyNewArrivals}
              onResetFilters={handleResetFilters}
              brandsList={brandsList}
              maxPriceLimit={MAX_PRICE}
              isMobileDrawer={true}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
            <div className="mt-8 pt-4 border-t border-slate-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 bg-brand-dark text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Show {products.length} Products
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopPage;
