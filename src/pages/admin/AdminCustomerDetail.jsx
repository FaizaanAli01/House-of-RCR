import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, User } from 'lucide-react';
import { fetchAdminCustomer } from '../../services/adminApi';

const statusColor = (status) => ({
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Processing: 'bg-purple-100 text-purple-700',
  Shipped: 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}[status] || 'bg-slate-100 text-slate-600');

const AdminCustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminCustomer(id)
      .then((data) => {
        setCustomer(data.customer);
        setOrders(data.orders || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;
  }

  if (!customer) {
    return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">{error || 'Customer not found.'}</div>;
  }

  const address = customer.address || {};
  const addressLines = [
    address.addressLine1,
    address.addressLine2,
    [address.city, address.state, address.pincode].filter(Boolean).join(', '),
    address.country,
  ].filter(Boolean);

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate('/admin/customers')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back to Customers
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Customer Details</h1>
        <p className="text-sm text-slate-500">Customer profile and recent orders</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-amber-600" />
          </div>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3 flex-1">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</p>
              <p className="font-semibold text-slate-800">{customer.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</p>
              <p className="text-sm text-slate-700">{customer.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</p>
              <p className="text-sm text-slate-700">{customer.phone || address.phone || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</p>
              <p className="text-sm text-slate-700">{new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Address</p>
              {addressLines.length ? addressLines.map((line) => <p key={line} className="text-sm text-slate-700">{line}</p>) : <p className="text-sm text-slate-400">No address on file.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Recent Orders</h2>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-400 px-5 py-8 text-center">No orders found for this customer.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <Link key={order._id} to={`/admin/orders/${order._id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}</p>
                  <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor(order.status)}`}>{order.status}</span>
                  <span className="text-sm font-semibold text-slate-800">₹{(order.total || 0).toLocaleString('en-IN')}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomerDetail;
