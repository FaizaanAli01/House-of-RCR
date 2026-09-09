import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { categories } from '../../data/categories';

const Footer = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      addToast('Thank you for subscribing! We will send you exclusive offers.', 'success');
      setEmail('');
    } else {
      addToast('Please enter a valid email address.', 'error');
    }
  };

  return (
    <footer className="bg-brand-dark text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Trust Guarantees */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-slate-800/80 text-amber-400 border border-slate-700">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Free Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Free delivery on all orders above ₹999 across India.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-slate-800/80 text-amber-400 border border-slate-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">100% Original Products</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Every piece is genuine quality with premium fabrics and stitching.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-slate-800/80 text-amber-400 border border-slate-700">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">7-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Hassle-free size exchange and doorstep return pickup.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-slate-800/80 text-amber-400 border border-slate-700">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Customer Support</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Friendly support available 7 days a week to help with your orders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-serif font-bold text-lg flex items-center justify-center">
                R
              </span>
              <span className="font-serif text-2xl font-bold tracking-wider text-white uppercase">
                House of RCR
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Premium Indian clothing brand for men and women. Bringing modern everyday style, festive collections, and comfortable fabrics right to your doorstep.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Get Latest Offers & Updates
              </div>
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm px-4 py-2.5 rounded-l-xl focus:outline-none focus:border-amber-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-5 py-2.5 rounded-r-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-serif text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/shop" className="hover:text-amber-400 transition-colors">
                  All Products
                </Link>
              </li>
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/shop?category=${cat.slug}`} className="hover:text-amber-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/cart" className="hover:text-amber-400 transition-colors">
                  My Shopping Cart
                </Link>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Track Order</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Size Guide</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Returns & Exchanges</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Help Center</span>
              </li>
            </ul>
          </div>

          {/* About & Contact */}
          <div>
            <h4 className="font-serif text-white font-semibold text-sm tracking-wider uppercase mb-4">
              About House of RCR
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><span className="text-slate-400 cursor-default">About Us</span></li>
              <li><span className="text-slate-400 cursor-default">Our Stores</span></li>
              <li><span className="text-slate-400 cursor-default">Quality Promise</span></li>
              <li><span className="text-slate-400 cursor-default">Terms & Privacy</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} House of RCR. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Made in India</span>
          <span>•</span>
          <span>Cash on Delivery</span>
          <span>•</span>
          <span>Fast Shipping</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
