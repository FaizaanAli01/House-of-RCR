import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;

const calcTotals = (items) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee =
    items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  return { subtotal, shippingFee, total: subtotal + shippingFee };
};

const resolveProduct = async (productId) => {
  if (mongoose.Types.ObjectId.isValid(productId)) {
    const p = await Product.findById(productId);
    if (p) return p;
  }
  return Product.findOne({ slug: productId });
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const items = cart ? cart.items : [];
    res.status(200).json({ success: true, cart: { items, ...calcTotals(items) } });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, color, size } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: 'Product ID is required.' });
    }
    const qty = parseInt(quantity, 10);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Quantity must be a positive integer.' });
    }

    const product = await resolveProduct(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: `"${product.name}" is currently out of stock.`,
      });
    }

    const selectedColor =
      color || (product.colors?.length > 0 ? product.colors[0].name : 'Default');
    const selectedSize =
      size || (product.sizes?.length > 0 ? product.sizes[0] : 'Free Size');

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const idx = cart.items.findIndex(
      (i) =>
        i.product.toString() === product._id.toString() &&
        i.color === selectedColor &&
        i.size === selectedSize
    );

    if (idx > -1) {
      const newQty = cart.items[idx].quantity + qty;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available. You already have ${cart.items[idx].quantity} in your cart.`,
        });
      }
      cart.items[idx].quantity = newQty;
    } else {
      if (qty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available in stock.`,
        });
      }
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        color: selectedColor,
        size: selectedSize,
        quantity: qty,
      });
    }

    await cart.save();
    const items = cart.items;
    res.status(200).json({
      success: true,
      message: `"${product.name}" added to cart.`,
      cart: { items, ...calcTotals(items) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const qty = parseInt(req.body.quantity, 10);

    if (!Number.isInteger(qty) || qty < 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Quantity must be a non-negative integer.' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const itemIdx = cart.items.findIndex((i) => i._id.toString() === itemId);
    if (itemIdx === -1) {
      return res
        .status(404)
        .json({ success: false, message: 'Cart item not found.' });
    }

    if (qty === 0) {
      cart.items.splice(itemIdx, 1);
    } else {
      const product = await Product.findById(cart.items[itemIdx].product);
      if (product && qty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available in stock.`,
        });
      }
      cart.items[itemIdx].quantity = qty;
    }

    await cart.save();
    const items = cart.items;
    res.status(200).json({
      success: true,
      message: 'Cart updated.',
      cart: { items, ...calcTotals(items) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove a specific item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }
    const itemIdx = cart.items.findIndex((i) => i._id.toString() === itemId);
    if (itemIdx === -1) {
      return res
        .status(404)
        .json({ success: false, message: 'Cart item not found.' });
    }
    cart.items.splice(itemIdx, 1);
    await cart.save();
    const items = cart.items;
    res.status(200).json({
      success: true,
      message: 'Item removed from cart.',
      cart: { items, ...calcTotals(items) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { upsert: true, new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Cart cleared.',
      cart: { items: [], subtotal: 0, shippingFee: 0, total: 0 },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Sync localStorage cart into DB cart on login
// @route   POST /api/cart/sync
// @access  Private
export const syncCart = async (req, res, next) => {
  try {
    const { items: localItems } = req.body;

    if (!Array.isArray(localItems) || localItems.length === 0) {
      return getCart(req, res, next);
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    for (const li of localItems) {
      const { productId, quantity, color, size } = li;
      const product = await resolveProduct(productId);
      if (!product || product.stock <= 0) continue;

      const selectedColor =
        color || (product.colors?.length > 0 ? product.colors[0].name : 'Default');
      const selectedSize =
        size || (product.sizes?.length > 0 ? product.sizes[0] : 'Free Size');
      const qty = Math.min(parseInt(quantity, 10) || 1, product.stock);

      const existing = cart.items.findIndex(
        (i) =>
          i.product.toString() === product._id.toString() &&
          i.color === selectedColor &&
          i.size === selectedSize
      );

      if (existing > -1) {
        cart.items[existing].quantity = Math.min(
          cart.items[existing].quantity + qty,
          product.stock
        );
      } else {
        cart.items.push({
          product: product._id,
          name: product.name,
          image: product.images?.[0] || '',
          price: product.price,
          color: selectedColor,
          size: selectedSize,
          quantity: qty,
        });
      }
    }

    await cart.save();
    const items = cart.items;
    res.status(200).json({
      success: true,
      message: 'Cart synced.',
      cart: { items, ...calcTotals(items) },
    });
  } catch (err) {
    next(err);
  }
};
