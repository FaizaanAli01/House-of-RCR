import React from 'react';
import { RotateCcw, Star, X } from 'lucide-react';
import { categories } from '../../data/categories';

const FilterSidebar = ({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedBrands,
  setSelectedBrands,
  minRating,
  setMinRating,
  onlyDeals,
  setOnlyDeals,
  onlyNewArrivals,
  setOnlyNewArrivals,
  onResetFilters,
  brandsList,
  maxPriceLimit = 5000,
  isMobileDrawer = false,
  onCloseMobile
}) => {
  const handleBrandToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="space-y-7">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h3 className="font-serif font-bold text-slate-900 text-lg">Filters</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
          {isMobileDrawer && (
            <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Special Highlights Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Filters
        </h4>
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
          <input
            type="checkbox"
            checked={onlyDeals}
            onChange={(e) => setOnlyDeals(e.target.checked)}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
          />
          <span>Discount Offers & Sale</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
          <input
            type="checkbox"
            checked={onlyNewArrivals}
            onChange={(e) => setOnlyNewArrivals(e.target.checked)}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
          />
          <span>New Arrivals</span>
        </label>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Category
        </h4>
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-brand-dark text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>All Clothing</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-brand-dark text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Max Price
          </h4>
          <span className="text-xs font-bold text-amber-800">
            Up to ₹{priceRange.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max={maxPriceLimit}
          step="100"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
        />
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>₹500</span>
          <span>₹{maxPriceLimit.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Brand Filters */}
      {brandsList.length > 1 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Brand Collection
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {brandsList.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 hover:text-slate-900"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[
            { label: '4.8 ★ & above', value: 4.8 },
            { label: '4.5 ★ & above', value: 4.5 },
            { label: '4.0 ★ & above', value: 4.0 },
            { label: 'All Ratings', value: 0 }
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setMinRating(item.value)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                minRating === item.value
                  ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FilterSidebar;
