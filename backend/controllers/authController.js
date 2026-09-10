import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  address: user.address || {},
  createdAt: user.createdAt,
});

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    console.log('[register] Step 1: validating input');
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required.' });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long.',
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'Passwords do not match.' });
    }

    console.log('[register] Step 2: checking for existing user');
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    console.log('[register] Step 3: hashing password with bcrypt.hashSync');
    const hashedPassword = bcrypt.hashSync(password, 12);
    console.log('[register] Step 3 complete: hash length =', hashedPassword.length);

    console.log('[register] Step 4: calling User.create()');
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });
    console.log('[register] Step 4 complete: user._id =', user._id);

    console.log('[register] Step 5: generating JWT');
    const token = generateToken(user._id);

    console.log('[register] SUCCESS');
    res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to House of RCR!',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error('[register] CAUGHT ERROR:', error.message);
    console.error('[register] ERROR TYPE:', error.constructor.name);
    console.error('[register] FULL STACK:\n', error.stack);
    next(error);
  }
};

// @desc    Login customer
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error('[login] CAUGHT ERROR:', error.message);
    console.error('[login] FULL STACK:\n', error.stack);
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: safeUser(req.user) });
};

// @desc    Logout (JWT is stateless; client removes the token)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};
