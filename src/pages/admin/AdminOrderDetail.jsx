import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminOrder, updateAdminOrderStatus } from '../../services/adminApi';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusColor = (s) => ({ Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-blue-100 text-blue-700', Processing: 'bg-purple-100 text-purple-700', Shipped: 'bg-indigo-100 text-indigo-700', Delivered: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700' }[s] || 'bg-slate-100 text-slate-600');

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchAdminOrder(id)
      .then((d) => { setOrder(d.order); setNewStatus(d.order.status); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async () => {
    setSaving(true); setSaved(false); setError('');
    try {
      const d = await updateAdminOrderStatus(id, newStatus);
      setOrder(d.order); setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;
  if (!order) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">{error || 'Order not found.'}</div>;

  const addr = order.shippingAddress || order.address || {};

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back to Orders
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{order.orderNumber || `#${id.slice(-6).toUpperCase()}`}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</p>
        </div>
        <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${statusColor(order.status)}`}>{order.status}</span>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Customer</p>
          <p className="font-semibold text-slate-800">{order.user?.name || '—'}</p>
          <p className="text-sm text-slate-500">{order.user?.email}</p>
          {order.user?.phone && <p className="text-sm text-slate-500 mt-0.5">{order.user.phone}</p>}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Shipping Address</p>
          {addr.street || addr.city || addr.name ? (
            <>
              {addr.name && <p className="font-semibold text-slate-800">{addr.name}</p>}
              {addr.street && <p className="text-sm text-slate-500">{addr.street}</p>}
              <p className="text-sm text-slate-500">{[addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}</p>
              {addr.phone && <p className="text-sm text-slate-500 mt-0.5">{addr.phone}</p>}
            </>
          ) : <p className="text-sm text-slate-400">No address on file.</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Update Order Status</p>
        <div className="flex items-center gap-3 flex-wrap">
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={handleStatusUpdate} disabled={saving || newStatus === order.status} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : null}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Update Status'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Order Items</p>
        </div>
        <div className="divide-y divide-slate-100">
          {(order.items || []).map((item, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-4">
              {item.image && <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg bg-slate-100 flex-shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 line-clamp-2">{item.name}</p>
                <div className="flex gap-3 mt-0.5">
                  {item.size && <p className="text-xs text-slate-400">Size: {item.size}</p>}
                  {item.color && <p className="text-xs text-slate-400">Color: {item.color}</p>}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-slate-800">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-400">₹{(item.price || 0).toLocaleString('en-IN')} each</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center px-5 py-4 bg-slate-50 border-t border-slate-200">
          <p className="font-semibold text-slate-700">Order Total</p>
          <p className="text-xl font-bold text-slate-800">₹{(order.total || 0).toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
