import React, { useState, useEffect } from 'react';
import { Flame, Loader2 } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import { fetchDealProducts } from '../../services/api';

const DealsSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadDeals = async () => {
      try {
        const data = await fetchDealProducts(4);
        if (isMounted) {
          setDealProducts(data || []);
        }
      } catch (err) {
        console.error('Error loading deal products:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDeals();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-brand-sand/50 to-brand-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Deal Header Card */}
        <div className="bg-brand-dark rounded-3xl p-6 sm:p-10 text-white shadow-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 max-w-lg z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Big Savings Sale</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Special Offers & Deals
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Grab up to 33% off on trending t-shirts, festive kurta sets, stylish jackets, and casual shirts. Limited stock available!
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 z-10">
            <div className="flex flex-col items-center justify-center bg-slate-800/90 border border-slate-700 px-4 py-3 rounded-2xl min-w-[72px]">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-amber-400">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Hours</span>
            </div>
            <span className="text-2xl font-bold text-amber-500">:</span>
            <div className="flex flex-col items-center justify-center bg-slate-800/90 border border-slate-700 px-4 py-3 rounded-2xl min-w-[72px]">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-amber-400">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Mins</span>
            </div>
            <span className="text-2xl font-bold text-amber-500">:</span>
            <div className="flex flex-col items-center justify-center bg-slate-800/90 border border-slate-700 px-4 py-3 rounded-2xl min-w-[72px]">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-amber-400">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Secs</span>
            </div>
          </div>

        </div>

        {/* Deals Products Grid */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <span className="text-xs font-medium">Loading live deals...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id || product.id || product.slug} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default DealsSection;
