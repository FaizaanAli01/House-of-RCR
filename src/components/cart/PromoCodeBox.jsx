import React, { useState } from 'react';
import { Tag, Check, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const PromoCodeBox = () => {
  const { appliedPromo, applyPromo, removePromo } = useCart();
  const [inputCode, setInputCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromo(inputCode.trim());
      setInputCode('');
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
        <Tag className="w-4 h-4 text-amber-600" />
        <span>Apply Discount Coupon</span>
      </div>

      {appliedPromo ? (
        <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="text-xs font-bold text-emerald-900 tracking-wider">
                {appliedPromo.code}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                {appliedPromo.label}
              </div>
            </div>
          </div>
          <button
            onClick={removePromo}
            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
            title="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Try 'RCR10' or 'FIRST15'"
            className="flex-1 bg-slate-50 border border-slate-200 uppercase text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500 placeholder:normal-case placeholder:font-normal"
          />
          <button
            type="submit"
            disabled={!inputCode.trim()}
            className="px-4 py-2 bg-brand-dark hover:bg-black disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
};

export default PromoCodeBox;
