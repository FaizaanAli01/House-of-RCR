const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const paymentRequest = async (endpoint, options = {}, token = null) => {
  const res = await fetch(`${API_BASE}/payments${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Payment request failed');
  return data;
};

// Reserved for the approved Razorpay test-mode step. This service is not
// imported by checkout yet, so the current order flow remains unchanged.
export const paymentApi = {
  createRazorpayOrder: (token, checkoutData) =>
    paymentRequest('/razorpay/order', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }, token),

  verifyRazorpayPayment: (token, paymentData) =>
    paymentRequest('/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }, token),
};
