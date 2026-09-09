import React from 'react';
import { ShieldCheck, Truck, Lock, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import PromoCodeBox from './PromoCodeBox';

const OrderSummary = ({ onOpenCheckout }) => {
  const {
    cartItems,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    grandTotal,
    appliedPromo,
    FREE_SHIPPING_THRESHOLD
  } = useCart();

  const isFreeShipping = shippingFee === 0 && subtotal > 0;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="space-y-6">
      
      {/* Free Delivery Meter */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 mb-2">
          <Truck className="w-4 h-4 text-amber-700" />
          {isFreeShipping ? (
            <span>Yay! You unlocked <strong>Free Delivery</strong> for this order!</span>
          ) : (
            <span>
              Add items worth <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for Free Delivery.
            </span>
          )}
        </div>
        <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-600 rounded-full transition-all duration-500"
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
      </div>

      {/* Main Breakdown Box */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
          Price Details
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Price ({cartItems.reduce((a, b) => a + b.quantity, 0)} items)</span>
            <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Coupon Discount ({appliedPromo?.code})</span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600">
            <span>Delivery Charges</span>
            <span>
              {isFreeShipping ? (
                <span className="text-emerald-700 font-bold uppercase text-[11px]">
                  FREE
                </span>
              ) : (
                `₹${shippingFee}`
              )}
            </span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Estimated GST / Tax (5%)</span>
            <span className="font-semibold text-slate-900">₹{taxAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900 font-serif">Total Amount</div>
            <div className="text-[11px] text-slate-400">All taxes and delivery included</div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-sans">
            ₹{grandTotal.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onOpenCheckout}
          disabled={cartItems.length === 0}
          className="w-full py-4 bg-brand-dark hover:bg-black disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
        >
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Safe & Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Promo Code Box */}
      <PromoCodeBox />

    </div>
  );
};

export default OrderSummary;
