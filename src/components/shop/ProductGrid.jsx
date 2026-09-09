import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, SearchX, RotateCcw } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import RatingStars from '../common/RatingStars';
import { useCart } from '../../context/CartContext';

const ProductGrid = ({
  products,
  viewMode,
  onResetFilters
}) => {
  const { addToCart } = useCart();

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto my-8">
        <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
          No Products Found
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          We couldn't find any products matching your search or filters. Try removing some filters or search for something else.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => {
          const productId = product._id || product.id || product.slug;
          const isOutOfStock = product.stock === 0;

          return (
            <div
              key={productId}
              className={`group bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm hover:shadow-luxury-hover transition-all duration-300 ${
                isOutOfStock ? 'opacity-85' : ''
              }`}
            >
              {/* Thumbnail */}
              <Link
                to={`/product/${productId}`}
                className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-slate-100 flex-shrink-0"
              >
                <img
                  src={product.images && product.images[0] ? product.images[0] : ''}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {isOutOfStock ? (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-rose-600 text-white">
                    Out of Stock
                  </span>
                ) : product.badge ? (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-brand-dark text-amber-300">
                    {product.badge}
                  </span>
                ) : null}
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    {product.brand}
                  </span>
                  <span className="text-xs text-slate-400">
                    {product.category}
                  </span>
                </div>

                <Link
                  to={`/product/${productId}`}
                  className="font-serif font-bold text-lg text-slate-900 group-hover:text-amber-800 transition-colors block"
                >
                  {product.name}
                </Link>

                <div className="flex items-center gap-3">
                  <RatingStars rating={product.rating || 5} reviewCount={product.reviewCount || 0} size="sm" />
                  <span className="text-xs text-slate-400">•</span>
                  <span className={`text-xs font-semibold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <div className="text-xl font-bold text-slate-900 font-sans">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-xs text-slate-400 line-through">
                      ₹{Number(product.originalPrice).toLocaleString('en-IN')} ({product.discount}% OFF)
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => !isOutOfStock && addToCart(product, 1)}
                    disabled={isOutOfStock}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-brand-dark hover:bg-black text-white'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>
                  <Link
                    to={`/product/${productId}`}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id || product.id || product.slug} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
