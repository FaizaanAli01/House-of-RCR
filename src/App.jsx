import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'; // Phase 4
import { Loader2 } from 'lucide-react';

// Existing customer pages (lazy-loaded)
const HomePage         = lazy(() => import('./pages/HomePage'));
const ShopPage         = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage         = lazy(() => import('./pages/CartPage'));
const LoginPage        = lazy(() => import('./pages/LoginPage'));
const RegisterPage     = lazy(() => import('./pages/RegisterPage'));
const AccountPage      = lazy(() => import('./pages/AccountPage'));
const OrderDetailPage  = lazy(() => import('./pages/OrderDetailPage'));

// Phase 4 admin pages (lazy-loaded — keep customer bundle lean)
const AdminLayout        = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard     = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts      = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm   = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrders        = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderDetail   = lazy(() => import('./pages/admin/AdminOrderDetail'));
const AdminCustomers     = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminCustomerDetail = lazy(() => import('./pages/admin/AdminCustomerDetail'));
const AdminInventory     = lazy(() => import('./pages/admin/AdminInventory'));

const PageLoader = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
  </div>
);

// Dedicated admin spinner (dark background matches admin UI)
const AdminLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
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
                {/* --- Customer routes (unchanged from Phase 3) --- */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="product/:id" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                </Route>

                {/* Auth pages — no Layout wrapper */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected customer routes inside Layout */}
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

                {/* --- Phase 4: Admin routes --- */}
                {/* All admin routes are guarded by ProtectedAdminRoute (auth + role check). */}
                {/* AdminLayout owns the sidebar+header shell and renders <Outlet />. */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <Suspense fallback={<AdminLoader />}>
                        <AdminLayout />
                      </Suspense>
                    </ProtectedAdminRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard"         element={<AdminDashboard />} />
                  <Route path="products"          element={<AdminProducts />} />
                  <Route path="products/new"      element={<AdminProductForm />} />
                  <Route path="products/:id/edit" element={<AdminProductForm />} />
                  <Route path="orders"            element={<AdminOrders />} />
                  <Route path="orders/:id"        element={<AdminOrderDetail />} />
                  <Route path="customers"         element={<AdminCustomers />} />
                  <Route path="customers/:id"     element={<AdminCustomerDetail />} />
                  <Route path="inventory"         element={<AdminInventory />} />
                </Route>

                {/* Catch-all 404 */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-[70vh] flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="font-serif text-5xl font-bold text-slate-900 mb-3">404</h1>
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
