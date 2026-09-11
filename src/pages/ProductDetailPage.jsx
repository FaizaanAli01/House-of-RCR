import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import ImageGallery from '../components/product/ImageGallery';
import ProductInfo from '../components/product/ProductInfo';
import SpecsAccordion from '../components/product/SpecsAccordion';
import RelatedProducts from '../components/product/RelatedProducts';
import { fetchProductById } from '../services/api';

const ProductDetailPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let isMounted = true;

    const loadProduct = async () => {
      setLoading(true);
      setProduct(null); // Clear stale product immediately so old data never flashes
      setError(null);
      try {
        const data = await fetchProductById(id);
        if (isMounted) {
          setProduct(data.product);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Product not found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-brand-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
          <span className="text-sm font-semibold">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] bg-brand-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            The product you are looking for is currently unavailable or may have been removed from our catalog.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Back to All Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-amber-800 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <Link to="/shop" className="hover:text-amber-800 transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <Link
            to={`/shop?category=${product.categorySlug || 'all'}`}
            className="hover:text-amber-800 transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-800 font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">

          {/* Left: Images */}
          <div>
            {/*
              key={id} forces remount of ImageGallery when navigating between products.
              This resets selectedImageIndex state so you always see the first
              image of the new product rather than a stale index from the previous one.
            */}
            <ImageGallery
              key={id}
              images={product.images || []}
              productName={product.name}
              badge={product.badge}
              discount={product.discount}
            />
          </div>

          {/* Right: Info */}
          <div>
            <ProductInfo product={product} />
          </div>

        </div>

        {/* Specs Accordion */}
        <SpecsAccordion specifications={product.specifications || {}} />

        {/* Related Products */}
        <RelatedProducts currentProduct={product} />

      </div>
    </div>
  );
};

export default ProductDetailPage;
