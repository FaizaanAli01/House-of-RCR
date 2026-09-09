import React, { useState, useEffect } from 'react';
import ProductCard from '../common/ProductCard';
import { fetchProducts } from '../../services/api';

const RelatedProducts = ({ currentProduct }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadRelated = async () => {
      try {
        const categorySlug = currentProduct.categorySlug || 'all';
        const data = await fetchProducts({ category: categorySlug, limit: 5 });
        const currentId = currentProduct._id || currentProduct.id || currentProduct.slug;

        const filtered = (data.products || [])
          .filter((p) => {
            const pId = p._id || p.id || p.slug;
            return pId !== currentId;
          })
          .slice(0, 4);

        if (isMounted) {
          setRelated(filtered);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    };

    if (currentProduct) {
      loadRelated();
    }

    return () => {
      isMounted = false;
    };
  }, [currentProduct]);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-slate-200">
      <div className="flex flex-col mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
          Recommendations
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          You May Also Like
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product) => (
          <ProductCard key={product._id || product.id || product.slug} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
