import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative bg-brand-midnight text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
        <img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80"
          alt="House of RCR Clothing Fashion"
          className="w-full h-full object-cover object-center scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-brand-midnight via-brand-midnight/90 to-brand-midnight/40" />

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>New Season Clothing Collection</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Modern Indian Style. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              Everyday Comfort.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
            Discover the latest collection from House of RCR. Premium cotton t-shirts, smart formal shirts, warm hoodies, comfortable jeans, and festive ethnic wear.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm tracking-wider uppercase shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/shop?filter=deals"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm tracking-wider uppercase backdrop-blur-sm border border-white/15 transition-all"
            >
              View Offers & Sale
            </Link>
          </div>

          {/* Key Trust Stats */}
          <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-800/80 max-w-lg">
            <div>
              <div className="text-2xl font-bold text-amber-300 font-serif">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Original Quality</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-300 font-serif">Free</div>
              <div className="text-xs text-slate-400 mt-0.5">Delivery Above ₹999</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-300 font-serif">7 Days</div>
              <div className="text-xs text-slate-400 mt-0.5">Easy Returns</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
