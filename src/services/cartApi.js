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
  if (!res.ok) throw new Error(data.message || 'Cart request failed');
  return data;
};

export const cartApi = {
  getCart: (token) => apiRequest('/cart', {}, token),

  addToCart: (token, productId, quantity, color, size) =>
    apiRequest(
      '/cart',
      { method: 'POST', body: JSON.stringify({ productId, quantity, color, size }) },
      token
    ),

  updateCartItem: (token, itemId, quantity) =>
    apiRequest(
      `/cart/${itemId}`,
      { method: 'PUT', body: JSON.stringify({ quantity }) },
      token
    ),

  removeFromCart: (token, itemId) =>
    apiRequest(`/cart/${itemId}`, { method: 'DELETE' }, token),

  clearCart: (token) => apiRequest('/cart', { method: 'DELETE' }, token),

  syncCart: (token, items) =>
    apiRequest(
      '/cart/sync',
      { method: 'POST', body: JSON.stringify({ items }) },
      token
    ),
};
