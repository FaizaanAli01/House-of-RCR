const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}, token = null) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Order request failed');
  return data;
};

export const orderApi = {
  createOrder: (token, orderData) =>
    apiRequest(
      '/orders',
      { method: 'POST', body: JSON.stringify(orderData) },
      token
    ),

  getMyOrders: (token) => apiRequest('/orders', {}, token),

  getOrderById: (token, id) => apiRequest(`/orders/${id}`, {}, token),
};
