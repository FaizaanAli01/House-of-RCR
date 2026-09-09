import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.key, item.quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.key, item.quantity - 1);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-b border-slate-200/80 last:border-0">
      
      {/* Thumbnail */}
      <Link
        to={`/product/${item.id}`}
        className="w-24 sm:w-28 aspect-square rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
          {item.brand}
        </div>

        <Link
          to={`/product/${item.id}`}
          className="font-serif font-bold text-base text-slate-900 hover:text-amber-800 transition-colors block line-clamp-1"
        >
          {item.name}
        </Link>

        {/* Variant Info */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-0.5">
          {item.color && item.color !== 'Default' && (
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-700">
              Color: {item.color}
            </span>
          )}
          {item.size && item.size !== 'Free Size' && (
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-700">
              Size: {item.size}
            </span>
          )}
        </div>

        <div className="text-xs text-slate-400 pt-1">
          Price: ₹{item.price.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Quantity Stepper & Price & Delete */}
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0">
        {/* Stepper */}
        <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1 shadow-sm">
          <button
            onClick={handleDecrement}
            className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-900">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={item.quantity >= item.stock}
            className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Item Price */}
        <div className="text-right min-w-[90px]">
          <div className="text-base font-bold text-slate-900">
            ₹{itemTotal.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(item.key)}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          title="Remove from cart"
          aria-label="Remove item from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default CartItem;
