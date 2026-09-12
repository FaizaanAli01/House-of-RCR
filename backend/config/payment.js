const DEFAULT_CURRENCY = 'INR';

export const getPaymentConfig = () => ({
  provider: 'razorpay',
  enabled: process.env.PAYMENTS_ENABLED === 'true',
  mode: (process.env.RAZORPAY_MODE || 'test').toLowerCase(),
  keyId: process.env.RAZORPAY_KEY_ID || '',
  keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  currency: process.env.RAZORPAY_CURRENCY || DEFAULT_CURRENCY,
});

export const assertRazorpayReady = () => {
  const config = getPaymentConfig();

  if (!config.enabled) {
    throw new Error('Payments are disabled. Set PAYMENTS_ENABLED=true only during an approved test-mode integration step.');
  }
  if (config.mode !== 'test') {
    throw new Error('Live Razorpay payments are not enabled in Phase 5 Step 1.');
  }
  if (!config.keyId || !config.keySecret) {
    throw new Error('Razorpay test credentials are not configured.');
  }

  return config;
};
