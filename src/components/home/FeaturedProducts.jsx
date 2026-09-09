import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import { fetchProducts } from '../../services/api';

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'all', label: 'All Featured' },
    { id: 't-shirts', label: 'T-Shirts' },
    { id: 'shirts', label: 'Shirts' },
    { id: 'hoodies-sweats', label: 'Hoodies' },
    { id: 'jeans-trousers', label: 'Jeans & Pants' },
    { id: 'ethnic-wear', label: 'Ethnic Wear' }
  ];

  useEffect(() => {
    let isMounted = true;
    const loadFeaturedProducts = async () => {
      setLoading(true);
      try {
        const params = { featured: 'true' };
        if (activeTab !== 'all') {
          params.category = activeTab;
        }
        const data = await fetchProducts(params);
        if (isMounted) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Error loading featured products:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFeaturedProducts();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Top Picks</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Featured Products
          </h2>
          <p className="text-sm text-slate-500">
            Check out our most popular clothing, loaded live from our store catalog.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner or Product Grid */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <span className="text-xs font-medium">Loading featured styles...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id || product.id || product.slug} product={product} />
            ))}
          </div>
        )}

        {/* Bottom CTA to Shop */}
        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm"
          >
            <span>View All Products in Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
