/**
 * House of RCR - Admin Account Creator
 * Usage (from /backend):
 *   node utils/createAdmin.js admin@example.com StrongPassword123
 * Or via env:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=StrongPass node utils/createAdmin.js
 *
 * Passwords are NEVER hardcoded. Do NOT expose via HTTP.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { connectDB } from '../config/db.js';
import User from '../models/User.js';

const email = process.env.ADMIN_EMAIL || process.argv[2];
const password = process.env.ADMIN_PASSWORD || process.argv[3];

if (!email || !password) {
  console.error('\n[createAdmin] ERROR: Email and password are required.');
  console.error('Usage: node utils/createAdmin.js <email> <password>');
  process.exit(1);
}
if (password.length < 6) {
  console.error('[createAdmin] ERROR: Password must be at least 6 characters.');
  process.exit(1);
}

try {
  await connectDB();
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    if (existing.role === 'admin') {
      console.log(`[createAdmin] "${email}" is already an admin. No changes made.`);
    } else {
      existing.role = 'admin';
      await existing.save();
      console.log(`[createAdmin] SUCCESS: Promoted "${email}" to admin.`);
    }
  } else {
    const hashedPassword = bcrypt.hashSync(password, 12);
    await User.create({ name: 'Admin', email: email.toLowerCase().trim(), password: hashedPassword, role: 'admin' });
    console.log(`[createAdmin] SUCCESS: Admin account created for "${email}".`);
  }
  await mongoose.disconnect();
  console.log('[createAdmin] Done.');
  process.exit(0);
} catch (err) {
  console.error('[createAdmin] FAILED:', err.message);
  process.exit(1);
}
