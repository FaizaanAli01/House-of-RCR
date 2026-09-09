import React, { useState } from 'react';
import { ChevronDown, Sparkles, Package, RefreshCw } from 'lucide-react';

const SpecsAccordion = ({ specifications = {} }) => {
  const [openSection, setOpenSection] = useState('specs');

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm divide-y divide-slate-100">
      
      {/* Product Details & Fabric */}
      <div className="py-4 first:pt-0">
        <button
          onClick={() => toggleSection('specs')}
          className="w-full flex items-center justify-between text-left font-serif text-lg font-bold text-slate-900 group"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Product Details & Fabric</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${
              openSection === 'specs' ? 'rotate-180 text-amber-600' : ''
            }`}
          />
        </button>

        {openSection === 'specs' && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2 border-b border-slate-50 text-xs">
                <span className="text-slate-500 font-medium">{key}</span>
                <span className="text-slate-900 font-semibold text-right">{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Packaging & Quality */}
      <div className="py-4">
        <button
          onClick={() => toggleSection('packaging')}
          className="w-full flex items-center justify-between text-left font-serif text-lg font-bold text-slate-900 group"
        >
          <div className="flex items-center gap-2.5">
            <Package className="w-4 h-4 text-amber-600" />
            <span>Packaging & Quality Assurance</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${
              openSection === 'packaging' ? 'rotate-180 text-amber-600' : ''
            }`}
          />
        </button>

        {openSection === 'packaging' && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              Each House of RCR garment is quality-checked before packing and delivered in a protective branded eco-friendly bag with official tags.
            </p>
            <p>
              All products are 100% original and brand new.
            </p>
          </div>
        )}
      </div>

      {/* Delivery & Returns */}
      <div className="py-4 last:pb-0">
        <button
          onClick={() => toggleSection('shipping')}
          className="w-full flex items-center justify-between text-left font-serif text-lg font-bold text-slate-900 group"
        >
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-amber-600" />
            <span>Delivery & 7-Day Returns</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${
              openSection === 'shipping' ? 'rotate-180 text-amber-600' : ''
            }`}
          />
        </button>

        {openSection === 'shipping' && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              <strong>Fast Delivery:</strong> Delivered within 3-5 business days across all pin codes in India. Free delivery on orders above ₹999.
            </p>
            <p>
              <strong>Easy Returns & Exchange:</strong> Not satisfied with the size or fit? Request an easy doorstep return or size exchange within 7 days of delivery.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default SpecsAccordion;
