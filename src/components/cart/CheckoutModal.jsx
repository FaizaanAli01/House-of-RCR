import React, { useState } from 'react';
import {
  X,
  Package,
  Loader2,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Lock,
  MapPin,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderApi } from '../../services/orderApi';

const CheckoutModal = ({ isOpen, onClose }) => {
  const {
    cartItems,
    subtotal,
    shippingFee,
    taxAmount,
    grandTotal,
    discountAmount,
    appliedPromo,
    clearCart,
  } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState('address'); // 'address' | 'review' | 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const addr = user?.address || {};
  const [form, setForm] = useState({
    fullName: addr.fullName || user?.name || '',
    phone: addr.phone || user?.phone || '',
    addressLine1: addr.addressLine1 || '',
    addressLine2: addr.addressLine2 || '',
    city: addr.city || '',
    state: addr.state || '',
    pincode: addr.pincode || '',
    country: addr.country || 'India',
  });

  if (!isOpen) return null;

  // Not authenticated — prompt to login
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl">
          <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
            Sign In to Checkout
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Please sign in or create an account to place your order.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              onClick={onClose}
              className="w-full py-3 bg-brand-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="w-full py-3 bg-amber-50 text-amber-800 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-amber-100 transition-colors"
            >
              Create Account
            </Link>
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    // Validate address
    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.addressLine1.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setError('Please fill in all required address fields.');
      setStep('address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const orderPayload = {
        shippingAddress: form,
        promoCode: appliedPromo?.code || null,
      };
      const data = await orderApi.createOrder(token, orderPayload);
      if (data.success) {
        setPlacedOrder(data.order);
        await clearCart();
        setStep('success');
        addToast('Order placed successfully! \ud83c\udf89', 'success');
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
      addToast(err.message || 'Order failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('address');
    setError('');
    setPlacedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            {step === 'success' ? 'Order Confirmed!' : 'Checkout'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
              {error}
            </div>
          )}

          {step === 'success' && placedOrder ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">
                Thank you, {user.name.split(' ')[0]}!
              </h3>
              <p className="text-sm text-slate-500 mb-2">
                Your order has been placed successfully.
              </p>
              <p className="font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl inline-block mb-5">
                {placedOrder.orderNumber}
              </p>
              <div className="bg-slate-50 rounded-2xl p-4 text-sm text-left space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Paid</span>
                  <span className="font-bold">
                    \u20b9{placedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-amber-700">
                    {placedOrder.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Items</span>
                  <span>{placedOrder.items.length}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    handleClose();
                    navigate(`/account/orders/${placedOrder._id}`);
                  }}
                  className="w-full py-3 bg-brand-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4 text-amber-400" /> View Order
                </button>
                <button
                  onClick={() => {
                    handleClose();
                    navigate('/shop');
                  }}
                  className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : step === 'address' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Delivery Address
                </h3>
              </div>

              {[
                { label: 'Full Name *', name: 'fullName' },
                { label: 'Phone Number *', name: 'phone' },
                { label: 'Address Line 1 *', name: 'addressLine1' },
                { label: 'Address Line 2 (optional)', name: 'addressLine2' },
                { label: 'City *', name: 'city' },
                { label: 'State *', name: 'state' },
                { label: 'PIN Code *', name: 'pincode' },
                { label: 'Country', name: 'country' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">
                    {f.label}
                  </label>
                  <input
                    name={f.name}
                    value={form[f.name]}
                    onChange={(e) =>
                      setForm({ ...form, [e.target.name]: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              ))}

              <button
                onClick={() => {
                  if (
                    !form.fullName.trim() ||
                    !form.phone.trim() ||
                    !form.addressLine1.trim() ||
                    !form.city.trim() ||
                    !form.state.trim() ||
                    !form.pincode.trim()
                  ) {
                    setError('Please fill in all required fields.');
                    return;
                  }
                  setError('');
                  setStep('review');
                }}
                className="w-full py-3 bg-brand-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 mt-2"
              >
                Review Order <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            // Review step
            <div className="space-y-4">
              {/* Address Summary */}
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                  Delivering to
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {form.fullName}
                </p>
                <p className="text-xs text-slate-500">{form.phone}</p>
                <p className="text-xs text-slate-500">
                  {form.addressLine1}
                  {form.addressLine2 ? `, ${form.addressLine2}` : ''},{' '}
                  {form.city}, {form.state} \u2014 {form.pincode}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center gap-3 text-sm"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate text-xs">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.color} \u00b7 {item.size} \u00b7 Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-xs text-slate-900 text-right flex-shrink-0">
                      \u20b9{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span>\u20b9{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-\u20b9{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <span>
                    {shippingFee === 0 ? 'Free' : `\u20b9${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GST (5%)</span>
                  <span>\u20b9{taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-2 mt-1">
                  <span>Total</span>
                  <span>\u20b9{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center">
                Prices are verified on the server. No payment required for now.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('address')}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Edit Address
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-2 flex-grow py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )}
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
