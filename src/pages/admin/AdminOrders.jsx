import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminOrders } from '../../services/adminApi';
import { Search, Loader2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const STATUSES = ['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusColor = (s) => ({ Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-blue-100 text-blue-700', Processing: 'bg-purple-100 text-purple-700', Shipped: 'bg-indigo-100 text-indigo-700', Delivered: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700' }[s] || 'bg-slate-100 text-slate-600');

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const d = await fetchAdminOrders({ search, status, page, limit: 20 });
      setOrders(d.orders || []); setTotal(d.total || 0); setTotalPages(d.totalPages || 1);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [search, status, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        <p className="text-sm text-slate-500">{total} total orders</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search order # or customer..." className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
          {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
        </select>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-amber-500" /></div>
        : orders.length === 0 ? <p className="text-center text-slate-400 py-16 text-sm">No orders found.</p>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['Order', 'Customer', 'Date', 'Items', 'Total', 'Status', ''].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{o.orderNumber || `#${o._id.slice(-6).toUpperCase()}`}</td>
                    <td className="px-4 py-3"><p className="font-medium text-slate-700">{o.user?.name || 'Guest'}</p><p className="text-xs text-slate-400">{o.user?.email}</p></td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-slate-600">{o.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">₹{(o.total || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor(o.status)}`}>{o.status}</span></td>
                    <td className="px-4 py-3"><Link to={`/admin/orders/${o._id}`} className="flex items-center gap-1 text-amber-600 hover:text-amber-800 font-medium text-xs"><Eye className="w-3.5 h-3.5" />View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
