import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));

const PageLoader = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
  </div>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes inside Layout */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="product/:slug" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                </Route>

                {/* Auth pages — no Layout wrapper */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected account routes inside Layout */}
                <Route path="/" element={<Layout />}>
                  <Route
                    path="account"
                    element={
                      <ProtectedRoute>
                        <AccountPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="account/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetailPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* 404 fallback */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-[70vh] flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="font-serif text-5xl font-bold text-slate-900 mb-3">
                          404
                        </h1>
                        <p className="text-slate-500 mb-6">Page not found.</p>
                        <a
                          href="/"
                          className="px-6 py-3 bg-brand-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
                        >
                          Go Home
                        </a>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
