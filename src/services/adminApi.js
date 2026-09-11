const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const adminRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('rcr_auth_token');
  const res = await fetch(`${API_BASE}/admin${endpoint}`, {
    headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
};

export const fetchDashboard = () => adminRequest('/dashboard');

export const fetchAdminProducts = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') q.append(k, v); });
  return adminRequest(`/products${q.toString() ? `?${q}` : ''}`);
};
export const fetchAdminProduct = (id) => adminRequest(`/products/${id}`);
export const createAdminProduct = (data) => adminRequest('/products', { method: 'POST', body: JSON.stringify(data) });
export const updateAdminProduct = (id, data) => adminRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAdminProduct = (id) => adminRequest(`/products/${id}`, { method: 'DELETE' });

export const fetchAdminOrders = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') q.append(k, v); });
  return adminRequest(`/orders${q.toString() ? `?${q}` : ''}`);
};
export const fetchAdminOrder = (id) => adminRequest(`/orders/${id}`);
export const updateAdminOrderStatus = (id, status) => adminRequest(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });

export const fetchAdminCustomers = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') q.append(k, v); });
  return adminRequest(`/customers${q.toString() ? `?${q}` : ''}`);
};
export const fetchAdminCustomer = (id) => adminRequest(`/customers/${id}`);

export const fetchInventory = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') q.append(k, v); });
  return adminRequest(`/inventory${q.toString() ? `?${q}` : ''}`);
};
export const updateInventoryStock = (id, stock) => adminRequest(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify({ stock }) });
