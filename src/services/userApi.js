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
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const userApi = {
  getProfile: (token) => apiRequest('/users/profile', {}, token),

  updateProfile: (token, profileData) =>
    apiRequest(
      '/users/profile',
      { method: 'PUT', body: JSON.stringify(profileData) },
      token
    ),

  updateAddress: (token, addressData) =>
    apiRequest(
      '/users/address',
      { method: 'PUT', body: JSON.stringify(addressData) },
      token
    ),
};
