import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Package,
  LogOut,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Edit2,
  Save,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userApi } from '../services/userApi';
import { orderApi } from '../services/orderApi';

const STATUS_COLORS = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-rose-100 text-rose-800',
};

// ---- Profile Tab ----
const ProfileTab = ({ user, token, updateUser }) => {
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim() || form.name.trim().length < 2) {
      addToast('Name must be at least 2 characters.', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await userApi.updateProfile(token, form);
      updateUser(data.user);
      addToast('Profile updated successfully.', 'success');
      setEditing(false);
    } catch (err) {
      addToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-bold text-slate-900">
          Profile Information
        </h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
            Full Name
          </label>
          {editing ? (
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-all"
            />
          ) : (
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
            Email Address
          </label>
          <p className="text-sm text-slate-600">{user.email}</p>
          <p className="text-xs text-slate-400 mt-0.5">Email cannot be changed</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
            Phone Number
          </label>
          {editing ? (
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Your phone number"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-all"
            />
          ) : (
            <p className="text-sm text-slate-600">{user.phone || '—'}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
            Member Since
          </label>
          <p className="text-sm text-slate-600">
            {new Date(user.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {editing && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2.5 bg-brand-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-amber-400" />
            )}
            Save Changes
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setForm({ name: user.name, phone: user.phone || '' });
            }}
            className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// ---- Address Tab ----
const AddressTab = ({ user, token, updateUser }) => {
  const { addToast } = useToast();
  const addr = user.address || {};
  const hasAddress = Boolean(addr.addressLine1);
  const [editing, setEditing] = useState(!hasAddress);
  const [form, setForm] = useState({
    fullName: addr.fullName || user.name || '',
    phone: addr.phone || user.phone || '',
    addressLine1: addr.addressLine1 || '',
    addressLine2: addr.addressLine2 || '',
    city: addr.city || '',
    state: addr.state || '',
    pincode: addr.pincode || '',
    country: addr.country || 'India',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await userApi.updateAddress(token, form);
      updateUser({ ...user, address: data.address });
      addToast('Address saved successfully.', 'success');
      setEditing(false);
    } catch (err) {
      addToast(err.message || 'Failed to save address.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addressFields = [
    { label: 'Full Name', name: 'fullName', required: true },
    { label: 'Phone Number', name: 'phone', required: true },
    { label: 'Address Line 1', name: 'addressLine1', required: true },
    { label: 'Address Line 2 (optional)', name: 'addressLine2', required: false },
    { label: 'City', name: 'city', required: true },
    { label: 'State', name: 'state', required: true },
    { label: 'PIN Code', name: 'pincode', required: true },
    { label: 'Country', name: 'country', required: false },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-bold text-slate-900">
          Shipping Address
        </h2>
        {!editing && hasAddress && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        )}
      </div>

      {!editing && hasAddress ? (
        <div className="space-y-1 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{addr.fullName}</p>
          <p>{addr.phone}</p>
          <p>
            {addr.addressLine1}
            {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
          </p>
          <p>
            {addr.city}, {addr.state} — {addr.pincode}
          </p>
          <p className="text-slate-500">{addr.country}</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {!hasAddress && (
            <p className="text-sm text-slate-500 mb-2">
              Add a shipping address for faster checkout.
            </p>
          )}
          {addressFields.map((f) => (
            <div key={f.name}>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
                {f.label}
              </label>
              <input
                name={f.name}
                required={f.required}
                value={form[f.name]}
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>
          ))}
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-brand-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 text-amber-400" />
              )}
              Save Address
            </button>
            {hasAddress && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

// ---- Orders Tab ----
const OrdersTab = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi
      .getMyOrders(token)
      .then((data) => {
        if (data.success) setOrders(data.orders);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
          No Orders Yet
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Start shopping to see your orders here.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order._id}
          to={`/account/orders/${order._id}`}
          className="block bg-white rounded-3xl border border-slate-200 shadow-sm p-5 hover:border-amber-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="font-mono text-xs font-bold text-slate-900">
                  {order.orderNumber}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {' · '}
                  {order.items.length} item
                  {order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 text-sm">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  STATUS_COLORS[order.status]
                }`}
              >
                {order.status}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
            </div>
          </div>

          {order.items[0] && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
              {order.items[0].image && (
                <img
                  src={order.items[0].image}
                  alt={order.items[0].name}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                />
              )}
              <p className="text-xs text-slate-500 truncate">
                {order.items[0].name}
                {order.items.length > 1
                  ? ` +${order.items.length - 1} more`
                  : ''}
              </p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

// ---- Main Account Page ----
const AccountPage = () => {
  const { user, token, logout, updateUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    await logout();
    addToast('Logged out successfully.', 'info');
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'orders', label: 'My Orders', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-brand-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              My Account
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Hello, {user.name.split(' ')[0]} 👋
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors px-3 py-2 rounded-xl hover:bg-rose-50"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-dark text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <ProfileTab user={user} token={token} updateUser={updateUser} />
        )}
        {activeTab === 'address' && (
          <AddressTab user={user} token={token} updateUser={updateUser} />
        )}
        {activeTab === 'orders' && <OrdersTab token={token} />}
      </div>
    </div>
  );
};

export default AccountPage;
