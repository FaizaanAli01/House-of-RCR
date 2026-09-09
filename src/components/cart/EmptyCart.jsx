import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-sm max-w-xl mx-auto my-8">
      <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
        <ShoppingBag className="w-10 h-10" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
        Your Cart is Empty
      </h2>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        Looks like you haven't added anything to your cart yet. Explore our latest t-shirts, shirts, jeans, and ethnic collections!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 bg-brand-dark hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
        <Link
          to="/shop?filter=deals"
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors"
        >
          View Offers & Deals
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
