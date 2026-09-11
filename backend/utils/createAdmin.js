/**
 * House of RCR — Admin Account Manager
 * =====================================
 * A safe CLI tool to manage admin accounts.
 * Run from the /backend directory.
 *
 * COMMANDS:
 *   node utils/createAdmin.js create  <email> <password>   Create a new admin
 *   node utils/createAdmin.js promote <email>              Promote existing user to admin
 *   node utils/createAdmin.js demote  <email>              Demote admin to customer
 *   node utils/createAdmin.js list                         List all admin accounts
 *   node utils/createAdmin.js remove  <email>              Remove an admin account
 *
 * NOTE: The User model has NO pre-save hook for hashing.
 *       Passwords are hashed explicitly here with bcrypt before saving,
 *       matching exactly how authController.js handles it.
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

const [, , command, emailArg, passwordArg] = process.argv;
const COMMANDS = ['create', 'promote', 'demote', 'list', 'remove'];

if (!command || !COMMANDS.includes(command)) {
  console.log(`
House of RCR — Admin Account Manager
=====================================
Usage:
  node utils/createAdmin.js create  <email> <password>   Create a new admin
  node utils/createAdmin.js promote <email>              Promote existing user to admin
  node utils/createAdmin.js demote  <email>              Demote admin to customer
  node utils/createAdmin.js list                         List all admin accounts
  node utils/createAdmin.js remove  <email>              Remove an admin account

Examples:
  node utils/createAdmin.js create admin@houseofrcr.com MyStr0ngPass!
  node utils/createAdmin.js promote faizaan@example.com
  node utils/createAdmin.js list
`);
  process.exit(1);
}

const normalizeEmail = (e) => (e || '').toLowerCase().trim();

try {
  await connectDB();

  // ── LIST
  if (command === 'list') {
    const admins = await User.find({ role: 'admin' }).select('name email createdAt').sort('email');
    if (admins.length === 0) {
      console.log('\n[list] No admin accounts found.\n');
    } else {
      console.log(`\n[list] ${admins.length} admin account(s):\n`);
      admins.forEach((a, i) => {
        console.log(`  ${i + 1}. ${a.name} <${a.email}>  (created: ${a.createdAt.toISOString().slice(0, 10)})`);
      });
      console.log();
    }
    await mongoose.disconnect();
    process.exit(0);
  }

  const email = normalizeEmail(emailArg);
  if (!email) {
    console.error(`[${command}] ERROR: Email is required.`);
    process.exit(1);
  }

  // ── CREATE
  if (command === 'create') {
    const password = passwordArg || process.env.ADMIN_PASSWORD;
    if (!password) {
      console.error(`[create] ERROR: Password is required.\n  Usage: node utils/createAdmin.js create <email> <password>`);
      process.exit(1);
    }
    if (password.length < 6) {
      console.error('[create] ERROR: Password must be at least 6 characters.');
      process.exit(1);
    }

    // Hash password explicitly — User model has no pre-save hook
    const hashedPassword = bcrypt.hashSync(password, 12);

    const existing = await User.findOne({ email });
    if (existing) {
      existing.role = 'admin';
      existing.password = hashedPassword;
      await existing.save();
      console.log(`[create] SUCCESS: "${email}" is now an admin (password updated).`);
    } else {
      await User.create({ name: 'Admin', email, password: hashedPassword, role: 'admin' });
      console.log(`[create] SUCCESS: Admin account created for "${email}".`);
    }
  }

  // ── PROMOTE (role only, password unchanged)
  else if (command === 'promote') {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`[promote] ERROR: No user found with email "${email}".`);
      process.exit(1);
    }
    if (user.role === 'admin') {
      console.log(`[promote] "${email}" is already an admin. No changes made.`);
    } else {
      user.role = 'admin';
      await user.save();
      console.log(`[promote] SUCCESS: "${email}" (${user.name}) is now an admin.`);
    }
  }

  // ── DEMOTE
  else if (command === 'demote') {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`[demote] ERROR: No user found with email "${email}".`);
      process.exit(1);
    }
    if (user.role !== 'admin') {
      console.log(`[demote] "${email}" is not an admin. No changes made.`);
    } else {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        console.error('[demote] ERROR: Cannot demote the last remaining admin.');
        process.exit(1);
      }
      user.role = 'customer';
      await user.save();
      console.log(`[demote] SUCCESS: "${email}" demoted to customer.`);
    }
  }

  // ── REMOVE
  else if (command === 'remove') {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`[remove] ERROR: No user found with email "${email}".`);
      process.exit(1);
    }
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        console.error('[remove] ERROR: Cannot remove the last remaining admin.');
        process.exit(1);
      }
    }
    await User.deleteOne({ _id: user._id });
    console.log(`[remove] SUCCESS: "${email}" permanently deleted.`);
  }

  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error(`[${command}] FAILED:`, err.message);
  process.exit(1);
}
