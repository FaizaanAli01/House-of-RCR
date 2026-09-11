/**
 * House of RCR — Admin Reset Tool
 * Wipes any existing admin with the given email and creates a fresh one.
 * Also verifies the password immediately so you know login will work.
 *
 * Usage (from /backend):
 *   node utils/resetAdmin.js <email> <password>
 *
 * Example:
 *   node utils/resetAdmin.js faizaan@admin.com MyPassword123
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { connectDB } from '../config/db.js';
import User from '../models/User.js';

const email    = (process.argv[2] || '').toLowerCase().trim();
const password = process.argv[3];

if (!email || !password) {
  console.error('\nUsage: node utils/resetAdmin.js <email> <password>\n');
  process.exit(1);
}
if (password.length < 6) {
  console.error('Password must be at least 6 characters.');
  process.exit(1);
}

try {
  await connectDB();
  console.log('\n[reset] Connected to MongoDB.');

  // Step 1 — Force-delete any existing account with this email
  const deleted = await User.deleteOne({ email });
  if (deleted.deletedCount > 0) {
    console.log(`[reset] Deleted old account for "${email}".`);
  } else {
    console.log(`[reset] No existing account found for "${email}" (that's fine).`);
  }

  // Step 2 — Hash the password manually.
  // The User model has NO pre-save hook — hashing is done explicitly here,
  // matching how authController.js handles registration.
  const hashedPassword = bcrypt.hashSync(password, 12);

  // Step 3 — Create fresh admin with the hashed password
  const admin = await User.create({
    name: 'Admin',
    email,
    password: hashedPassword,
    role: 'admin',
  });
  console.log(`[reset] Created fresh admin account for "${email}".`);

  // Step 4 — Immediately verify: re-fetch and compare
  const saved = await User.findById(admin._id).select('+password');
  const passwordOk = await bcrypt.compare(password, saved.password);

  if (passwordOk) {
    console.log('\n[reset] PASSWORD VERIFIED ✅ Login will work.');
    console.log(`        Email:    ${email}`);
    console.log(`        Password: ${password}`);
    console.log('        Go to: http://localhost:5173/login\n');
  } else {
    console.error('\n[reset] PASSWORD MISMATCH ❌ Something is wrong with bcrypt storage.\n');
    process.exit(1);
  }

  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('[reset] FAILED:', err.message);
  process.exit(1);
}
