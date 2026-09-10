import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/orderApi';

const STATUS_COLORS = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  Shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
};

const STATUS_STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi
      .getOrderById(token, id)
      .then((data) => {
        if (data.success) setOrder(data.order);
      })
      .catch((err) => setError(err.message || 'Order not found.'))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <Link
            to="/account"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-brand-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          to="/account"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Order Details
              </span>
              <h1 className="font-mono text-lg font-bold text-slate-900 mt-1">
                {order.orderNumber}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Placed on{' '}
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                STATUS_COLORS[order.status]
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Status Progress (only for non-cancelled) */}
          {order.status !== 'Cancelled' && (
            <div className="flex items-center gap-0 mt-5">
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        i <= currentStep
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {i < currentStep ? '\u2713' : i + 1}
                    </div>
                    <span
                      className={`text-[10px] font-semibold mt-1 ${
                        i <= currentStep ? 'text-amber-700' : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 -mt-4 mx-1 ${
                        i < currentStep ? 'bg-amber-400' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Ordered Items */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Ordered Items ({order.items.length})
          </h2>
          <div className="divide-y divide-slate-100">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-slate-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.color} · {item.size} · Qty {item.quantity}
                  </p>
                  <p className="text-xs text-slate-400">
                    ₹{item.price.toLocaleString('en-IN')} each
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-900 text-right">
                  ₹{item.itemTotal.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Price Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({order.promoCode})</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping</span>
                <span>
                  {order.shippingFee === 0
                    ? 'Free'
                    : `₹${order.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST (5%)</span>
                <span>₹{order.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 mt-2 font-bold text-base">
                <span>Total</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Shipping Address
            </h2>
            <div className="space-y-1 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.phone}</p>
              <p>
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2
                  ? `, ${order.shippingAddress.addressLine2}`
                  : ''}
              </p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} —{' '}
                {order.shippingAddress.pincode}
              </p>
              <p className="text-slate-500">{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
