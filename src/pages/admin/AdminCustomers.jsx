import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminCustomers } from '../../services/adminApi';
import { Search, Loader2, ChevronLeft, ChevronRight, Eye, User } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const d = await fetchAdminCustomers({ search, page, limit: 20 });
      setCustomers(d.customers || []); setTotal(d.total || 0); setTotalPages(d.totalPages || 1);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
        <p className="text-sm text-slate-500">{total} registered customers</p>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name or email..." className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400" />
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-amber-500" /></div>
        : customers.length === 0 ? <p className="text-center text-slate-400 py-16 text-sm">No customers found.</p>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['Customer', 'Email', 'Joined', 'Orders', ''].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="font-medium text-slate-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{c.email}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">{c.orderCount ?? 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/customers/${c._id}`} className="flex items-center gap-1 text-amber-600 hover:text-amber-800 font-medium text-xs">
                        <Eye className="w-3.5 h-3.5" />View
                      </Link>
                    </td>
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

export default AdminCustomers;
