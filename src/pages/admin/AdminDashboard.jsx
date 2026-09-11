import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboard } from '../../services/adminApi';
import { Package, ShoppingBag, Users, AlertTriangle, CheckCircle, TrendingUp, ArchiveX, Clock, Loader2 } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color = 'text-slate-700', bg = 'bg-white', sub }) => (
  <div className={`${bg} rounded-xl p-5 shadow-sm border border-slate-200 flex items-start gap-4`}>
    <div className={`p-3 rounded-lg bg-slate-100 ${color}`}><Icon className="w-5 h-5" /></div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-0.5">{value ?? '\u2014'}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const statusColor = (s) => {
  const m = { Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-blue-100 text-blue-700', Processing: 'bg-purple-100 text-purple-700', Shipped: 'bg-indigo-100 text-indigo-700', Delivered: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700' };
  return m[s] || 'bg-slate-100 text-slate-600';
};

const stockColor = (n) => n === 0 ? 'bg-red-100 text-red-700' : n <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';
const stockLabel = (n) => n === 0 ? 'Out of Stock' : n <= 3 ? 'Low Stock' : 'In Stock';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm">{error}</div>;

  const { stats, recentOrders, lowStockItems } = data || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome to the House of RCR Admin Control Room</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats?.totalProducts} color="text-blue-600" />
        <StatCard icon={Users} label="Customers" value={stats?.totalCustomers} color="text-purple-600" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders} color="text-amber-600" />
        <StatCard icon={TrendingUp} label="Revenue" value={`\u20b9${(stats?.totalRevenue||0).toLocaleString('en-IN')}`} color="text-green-600" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Pending" value={stats?.pendingOrders} color="text-yellow-600" bg="bg-yellow-50" />
        <StatCard icon={CheckCircle} label="Delivered" value={stats?.deliveredOrders} color="text-green-600" bg="bg-green-50" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={stats?.lowStockProducts} color="text-orange-600" bg="bg-orange-50" sub="\u22643 units" />
        <StatCard icon={ArchiveX} label="Out of Stock" value={stats?.outOfStockProducts} color="text-red-600" bg="bg-red-50" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-amber-600 hover:underline font-medium">View all</Link>
          </div>
          {recentOrders?.length ? (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((o) => (
                <Link to={`/admin/orders/${o._id}`} key={o._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{o.orderNumber || `#${o._id.slice(-6).toUpperCase()}`}</p>
                    <p className="text-xs text-slate-400">{o.user?.name||'Guest'} \u00b7 \u20b9{(o.total||0).toLocaleString('en-IN')}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor(o.status)}`}>{o.status}</span>
                </Link>
              ))}
            </div>
          ) : <p className="text-sm text-slate-400 px-5 py-8 text-center">No orders yet.</p>}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">Low / Out of Stock</h2>
            <Link to="/admin/inventory" className="text-xs text-amber-600 hover:underline font-medium">View all</Link>
          </div>
          {lowStockItems?.length ? (
            <div className="divide-y divide-slate-100">
              {lowStockItems.map((p) => (
                <div key={p._id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded object-cover bg-slate-100" onError={e=>{e.target.style.display='none'}} />}
                    <div>
                      <p className="text-sm font-medium text-slate-700 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.category}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${stockColor(p.stock)}`}>{stockLabel(p.stock)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-slate-400 px-5 py-8 text-center">All items well stocked.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
