import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, AlertCircle } from 'lucide-react';
import RatingStars from './RatingStars';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const productId = product._id || product.id || product.slug;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  return (
    <div className={`group relative flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-luxury-hover transition-all duration-300 transform hover:-translate-y-1 ${
      isOutOfStock ? 'opacity-85' : ''
    }`}>
      {/* Product Image */}
      <Link to={`/product/${productId}`} className="relative block aspect-[4/5] bg-slate-100 overflow-hidden">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {/* Stock Badges */}
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full shadow-sm bg-rose-600 text-white flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Out of Stock</span>
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full shadow-sm bg-amber-500 text-slate-950 font-sans">
              Only {product.stock} left
            </span>
          ) : product.badge ? (
            <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full shadow-sm ${
              product.badge === 'Best Seller'
                ? 'bg-amber-500 text-white'
                : product.badge === 'Festive Special'
                ? 'bg-purple-700 text-white'
                : 'bg-emerald-600 text-white'
            }`}>
              {product.badge}
            </span>
          ) : null}

          {/* Discount Badge */}
          {product.discount > 0 && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-slate-900 text-amber-300 rounded-full shadow-sm w-fit">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <div className="w-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-xl shadow-lg transition-colors ${
                isOutOfStock
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-brand-dark hover:bg-black text-white'
              }`}
              title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
            <Link
              to={`/product/${productId}`}
              className="p-2.5 bg-white/90 hover:bg-white text-brand-dark rounded-xl shadow-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-700">
            {product.brand}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {product.category ? product.category.split('&')[0].trim() : ''}
          </span>
        </div>

        <Link
          to={`/product/${productId}`}
          className="font-serif font-semibold text-slate-900 text-base leading-snug group-hover:text-amber-800 transition-colors line-clamp-2 mb-2"
        >
          {product.name}
        </Link>

        <div className="mb-3">
          <RatingStars rating={product.rating || 5} reviewCount={product.reviewCount || 0} size="sm" />
        </div>

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900 font-sans">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <Link
            to={`/product/${productId}`}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
