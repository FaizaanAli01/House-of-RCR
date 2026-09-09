import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import { fetchNewArrivals } from '../../services/api';

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadNewArrivals = async () => {
      try {
        const data = await fetchNewArrivals(4);
        if (isMounted) {
          setNewArrivals(data || []);
        }
      } catch (err) {
        console.error('Error loading new arrivals:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNewArrivals();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fresh Styles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800 hover:text-amber-950 transition-colors"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* New Arrivals Grid */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <span className="text-xs font-medium">Loading fresh drops...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product._id || product.id || product.slug} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default NewArrivals;
