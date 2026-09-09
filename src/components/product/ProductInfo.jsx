import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw, Plus, Minus, Check, AlertCircle } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { useCart } from '../../context/CartContext';

const ProductInfo = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const stock = Number(product.stock) || 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 3;

  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default'
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size'
  );
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate('/cart');
  };

  const savingsAmount = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <div className="space-y-6">
      {/* Brand & Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
          {product.brand || 'House of RCR'}
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-1 leading-tight">
          {product.name}
        </h1>

        {/* Rating and Reviews */}
        <div className="mt-3 flex items-center gap-3">
          <RatingStars rating={product.rating || 5} reviewCount={product.reviewCount || 0} size="md" />
          <span className="text-xs text-slate-300">|</span>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Genuine Quality</span>
          </span>
        </div>
      </div>

      {/* Price & Savings */}
      <div className="p-4 rounded-2xl bg-brand-50 border border-slate-200/80">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-slate-900 font-sans">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-base text-slate-400 line-through">
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </span>
              <span className="px-2 py-0.5 text-xs font-bold text-rose-700 bg-rose-100 rounded-md">
                Save ₹{savingsAmount.toLocaleString('en-IN')} ({product.discount}% OFF)
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1.5">
          Inclusive of all taxes. Free delivery on orders above ₹999.
        </p>
      </div>

      {/* Real Inventory / Stock Level Indicator */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Out of Stock — Currently unavailable for purchase</span>
          </div>
        ) : isLowStock ? (
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Only {stock} left in stock — order soon!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>In Stock ({stock} items available in store)</span>
          </div>
        )}
      </div>

      {/* Short Description */}
      <p className="text-sm text-slate-600 leading-relaxed">
        {product.description}
      </p>

      {/* Highlights List */}
      {product.highlights && product.highlights.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Key Features:
          </div>
          <ul className="space-y-1">
            {product.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Color Swatches */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-700">
              Select Color:
            </span>
            <span className="text-slate-500 font-medium">{selectedColor}</span>
          </div>
          <div className="flex items-center gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  selectedColor === c.name
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-400/30'
                    : 'border-slate-200 hover:border-slate-400 bg-white text-slate-700'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-700">
              Select Size:
            </span>
            <span className="text-slate-500 font-medium">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                  selectedSize === size
                    ? 'border-brand-dark bg-brand-dark text-white shadow-sm'
                    : 'border-slate-200 hover:border-slate-400 bg-white text-slate-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector & Action CTAs */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-4">
          
          {/* Quantity Stepper */}
          <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1 shadow-sm">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1 || isOutOfStock}
              className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-bold text-slate-900">
              {isOutOfStock ? 0 : quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= stock || isOutOfStock}
              className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add To Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 py-3.5 px-6 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
              isOutOfStock
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-brand-dark hover:bg-black text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>

        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className={`w-full py-3.5 px-6 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
          }`}
        >
          <Zap className={`w-4 h-4 ${isOutOfStock ? 'text-slate-400' : 'text-slate-950 fill-slate-950'}`} />
          <span>{isOutOfStock ? 'Currently Unavailable' : 'Buy Now (Instant Checkout)'}</span>
        </button>
      </div>

      {/* Trust Guarantees */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center">
        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm space-y-1">
          <Truck className="w-4 h-4 text-amber-600 mx-auto" />
          <div className="text-[11px] font-bold text-slate-800">Free Delivery</div>
          <div className="text-[10px] text-slate-400">On orders ₹999+</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm space-y-1">
          <ShieldCheck className="w-4 h-4 text-amber-600 mx-auto" />
          <div className="text-[11px] font-bold text-slate-800">100% Genuine</div>
          <div className="text-[10px] text-slate-400">Direct from Brand</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm space-y-1">
          <RotateCcw className="w-4 h-4 text-amber-600 mx-auto" />
          <div className="text-[11px] font-bold text-slate-800">7-Day Returns</div>
          <div className="text-[10px] text-slate-400">Doorstep Pickup</div>
        </div>
      </div>

    </div>
  );
};

export default ProductInfo;
