import React from 'react';
import { ArrowUpDown, LayoutGrid, List } from 'lucide-react';

const SortDropdown = ({
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalResults
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      
      {/* Result Count */}
      <div className="text-sm text-slate-600">
        Showing <span className="font-bold text-slate-900">{totalResults}</span> {totalResults === 1 ? 'product' : 'products'}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-xs font-semibold uppercase text-slate-500 hidden sm:inline">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-amber-500 cursor-pointer appearance-none shadow-sm"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="discount">Biggest Discount</option>
              <option value="newest">Newest First</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default SortDropdown;
