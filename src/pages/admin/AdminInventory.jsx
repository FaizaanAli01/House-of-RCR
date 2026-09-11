import React, { useEffect, useState, useCallback } from 'react';
import { fetchInventory, updateInventoryStock } from '../../services/adminApi';
import { Loader2, ChevronLeft, ChevronRight, Save } from 'lucide-react';

const stockStatus = (n) =>
  n === 0 ? { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' }
  : n <= 3  ? { label: 'Low Stock',    cls: 'bg-yellow-100 text-yellow-700' }
  :           { label: 'In Stock',     cls: 'bg-green-100 text-green-700' };

const AdminInventory = () => {
  const [products, setProducts]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary]     = useState({});
  const [page, setPage]           = useState(1);
  const [filter, setFilter]       = useState('all');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [editMap, setEditMap]     = useState({});
  const [saving, setSaving]       = useState({});
  const [feedback, setFeedback]   = useState({});

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const d = await fetchInventory({ filter, page, limit: 30 });
      setProducts(d.products || []);
      setTotal(d.total || 0);
      setTotalPages(d.totalPages || 1);
      setSummary(d.summary || {});
      setEditMap({});
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (id) => {
    const val = editMap[id];
    if (val === undefined || val === '') return;
    const num = Number(val);
    if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
      setFeedback((f) => ({ ...f, [id]: { error: true, msg: 'Must be a whole number \u22650' } }));
      return;
    }
    setSaving((s) => ({ ...s, [id]: true }));
    setFeedback((f) => ({ ...f, [id]: null }));
    try {
      await updateInventoryStock(id, num);
      setProducts((ps) => ps.map((p) => p._id === id ? { ...p, stock: num } : p));
      setEditMap((m) => { const n = { ...m }; delete n[id]; return n; });
      setFeedback((f) => ({ ...f, [id]: { error: false, msg: 'Saved!' } }));
      setTimeout(() => setFeedback((f) => ({ ...f, [id]: null })), 2000);
    } catch (e) {
      setFeedback((f) => ({ ...f, [id]: { error: true, msg: e.message } }));
    } finally { setSaving((s) => ({ ...s, [id]: false })); }
  };

  const FILTERS = [
    { key: 'out', label: 'Out of Stock', value: summary.outOfStock ?? 0, cls: 'bg-red-50 border-red-200 text-red-700' },
    { key: 'low', label: 'Low Stock (\u22643)', value: summary.lowStock  ?? 0, cls: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    { key: 'in',  label: 'In Stock',       value: summary.inStock   ?? 0, cls: 'bg-green-50 border-green-200 text-green-700' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
        <p className="text-sm text-slate-500">{total} products shown</p>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-3">
        {FILTERS.map((f) => (
          <button key={f.key}
            onClick={() => { setFilter((cur) => cur === f.key ? 'all' : f.key); setPage(1); }}
            className={`rounded-xl border p-4 text-left transition-all ${f.cls} ${filter === f.key ? 'ring-2 ring-offset-1 ring-amber-400' : 'opacity-80 hover:opacity-100'}`}>
            <p className="text-2xl font-bold">{f.value}</p>
            <p className="text-xs font-medium mt-0.5">{f.label}</p>
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-amber-500" /></div>
        ) : products.length === 0 ? (
          <p className="text-center text-slate-400 py-16 text-sm">No products match this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Product', 'Category', 'Price', 'Current Stock', 'Status', 'Update Stock'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const { label, cls } = stockStatus(p.stock);
                  const editVal = editMap[p._id] ?? '';
                  const fb = feedback[p._id];
                  return (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.images?.[0] && (
                            <img src={p.images[0]} alt={p.name} className="w-9 h-10 object-cover rounded bg-slate-100 flex-shrink-0"
                              onError={(e) => { e.target.style.display = 'none'; }} />
                          )}
                          <span className="font-medium text-slate-800 line-clamp-2">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{p.category}</td>
                      <td className="px-4 py-3 text-slate-700 whitespace-nowrap">₹{(p.price || 0).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{p.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number" min="0" step="1" value={editVal}
                            onChange={(e) => setEditMap((m) => ({ ...m, [p._id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave(p._id)}
                            placeholder={String(p.stock)}
                            className="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                          <button
                            onClick={() => handleSave(p._id)}
                            disabled={!editVal || saving[p._id]}
                            className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white transition-colors">
                            {saving[p._id]
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Save className="w-3.5 h-3.5" />}
                          </button>
                          {fb && (
                            <span className={`text-[11px] font-medium whitespace-nowrap ${fb.error ? 'text-red-600' : 'text-green-600'}`}>{fb.msg}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
