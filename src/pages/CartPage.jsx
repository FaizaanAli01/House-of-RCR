import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import EmptyCart from '../components/cart/EmptyCart';
import CheckoutModal from '../components/cart/CheckoutModal';

const CartPage = () => {
  const { cartItems, totalItemsCount, clearCart } = useCart();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="bg-brand-50 min-h-screen py-12 px-4">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="bg-brand-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Shopping Bag
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
              Your Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>

            <button
              onClick={clearCart}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        {/* Cart Page Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items List */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm divide-y divide-slate-100">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Item Details</span>
              <span className="hidden sm:inline">Price & Quantity</span>
            </div>

            {cartItems.map((item) => (
              <CartItem key={item.key} item={item} />
            ))}

            {/* Bottom note */}
            <div className="pt-6 flex items-center gap-3 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>All products are genuine, checked for quality, and backed by 7-day easy returns.</span>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-5 sticky top-28">
            <OrderSummary onOpenCheckout={() => setCheckoutModalOpen(true)} />
          </div>

        </div>

      </div>

      {/* Simulated Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </div>
  );
};

export default CartPage;
