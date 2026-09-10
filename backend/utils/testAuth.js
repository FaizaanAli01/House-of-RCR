/**
 * Quick end-to-end auth test script.
 * Run from /backend: node utils/testAuth.js
 * Requires the backend server to be running on localhost:5000.
 */

const BASE = 'http://localhost:5000/api';
const EMAIL = `test_${Date.now()}@rcr-test.com`;
const PASSWORD = 'TestPass123';

const req = async (path, opts = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  const data = await res.json();
  return { status: res.status, data };
};

const pass = (label) => console.log(`  \x1b[32m✓\x1b[0m ${label}`);
const fail = (label, detail, stack) => {
  console.error(`  \x1b[31m✗\x1b[0m ${label}: ${detail}`);
  if (stack) {
    console.error('\n  ---- SERVER STACK TRACE (copy this to share) ----');
    console.error(stack);
    console.error('  --------------------------------------------------\n');
  }
  process.exit(1);
};

(async () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' House of RCR — Auth endpoint test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ── 1. Health check ───────────────────────────────
  console.log('1. Health check');
  const health = await req('/health');
  if (health.status !== 200 || !health.data.success)
    fail('Health', JSON.stringify(health.data));
  pass(`Server healthy — phase: ${health.data.phase}`);

  // ── 2. Register ──────────────────────────────────
  console.log('\n2. POST /api/auth/register');
  const reg = await req('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'RCR Test User',
      email: EMAIL,
      password: PASSWORD,
      confirmPassword: PASSWORD,
    }),
  });
  if (reg.status !== 201 || !reg.data.success) {
    console.error('  Full server response:', JSON.stringify(reg.data, null, 2));
    fail('Register', reg.data.message || JSON.stringify(reg.data), reg.data.stack);
  }
  const { token, user } = reg.data;
  pass(`Registered → _id: ${user._id}, email: ${user.email}`);
  if (!token) fail('Register', 'No token returned');
  pass(`JWT token received (${token.slice(0, 20)}…)`);

  // ── 3. Duplicate register (should 400) ─────────────────
  console.log('\n3. Duplicate registration (expect 400)');
  const dup = await req('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Dupe', email: EMAIL, password: PASSWORD, confirmPassword: PASSWORD,
    }),
  });
  if (dup.status !== 400)
    fail('Duplicate register', `Expected 400, got ${dup.status}`);
  pass(`Correctly rejected with: "${dup.data.message}"`);

  // ── 4. Login ─────────────────────────────────────
  console.log('\n4. POST /api/auth/login');
  const login = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (login.status !== 200 || !login.data.success) {
    console.error('  Full server response:', JSON.stringify(login.data, null, 2));
    fail('Login', login.data.message || JSON.stringify(login.data), login.data.stack);
  }
  const loginToken = login.data.token;
  pass(`Logged in → token: ${loginToken.slice(0, 20)}…`);

  // ── 5. Wrong password (should 401) ───────────────────
  console.log('\n5. Wrong password (expect 401)');
  const bad = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: EMAIL, password: 'wrongpassword' }),
  });
  if (bad.status !== 401)
    fail('Wrong password', `Expected 401, got ${bad.status}`);
  pass(`Correctly rejected with: "${bad.data.message}"`);

  // ── 6. GET /api/auth/me ─────────────────────────────
  console.log('\n6. GET /api/auth/me (protected)');
  const me = await req('/auth/me', {
    headers: { Authorization: `Bearer ${loginToken}` },
  });
  if (me.status !== 200 || !me.data.success) {
    console.error('  Full server response:', JSON.stringify(me.data, null, 2));
    fail('/auth/me', me.data.message || JSON.stringify(me.data), me.data.stack);
  }
  pass(`Profile returned → name: ${me.data.user.name}, email: ${me.data.user.email}`);

  // ── 7. No token (should 401) ─────────────────────────
  console.log('\n7. No token on protected route (expect 401)');
  const noAuth = await req('/auth/me');
  if (noAuth.status !== 401)
    fail('No token', `Expected 401, got ${noAuth.status}`);
  pass(`Correctly blocked: "${noAuth.data.message}"`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' \x1b[32mAll 7 checks passed ✓\x1b[0m');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
})();
