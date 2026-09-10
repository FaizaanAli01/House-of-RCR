import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;
const TAX_RATE = 0.05; // 5% GST

// @desc    Create order from user's cart
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, promoCode } = req.body;

    // 1. Validate shipping address
    const { fullName, phone, addressLine1, city, state, pincode } =
      shippingAddress || {};
    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message:
          'Complete shipping address required: fullName, phone, addressLine1, city, state, pincode.',
      });
    }

    // 2. Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Your cart is empty.' });
    }

    // 3. Validate stock and build order items — prices fetched from DB, never trusted from frontend
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product "${cartItem.name}" is no longer available. Please update your cart.`,
        });
      }
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} unit(s) left.`,
        });
      }

      const itemTotal = product.price * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price, // <-- DB price, not frontend price
        color: cartItem.color,
        size: cartItem.size,
        quantity: cartItem.quantity,
        itemTotal,
      });
    }

    // 4. Shipping
    const shippingFee =
      subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

    // 5. Promo code
    let discountAmount = 0;
    let validPromo = null;
    if (promoCode) {
      const code = promoCode.trim().toUpperCase();
      if (code === 'RCR10') {
        discountAmount = Math.round((subtotal * 10) / 100);
        validPromo = 'RCR10';
      } else if (code === 'FIRST15') {
        discountAmount = Math.round((subtotal * 15) / 100);
        validPromo = 'FIRST15';
      }
    }

    // 6. Tax & total
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * TAX_RATE);
    const total = Math.max(0, taxableAmount + shippingFee + taxAmount);

    // 7. Create order document
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: shippingAddress.addressLine2?.trim() || '',
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        country: shippingAddress.country?.trim() || 'India',
      },
      subtotal,
      shippingFee,
      discountAmount,
      promoCode: validPromo,
      taxAmount,
      total,
      status: 'Pending',
    });

    // 8. Atomically reduce stock — guard prevents negative stock
    const stockErrors = [];
    for (const cartItem of cart.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: cartItem.product, stock: { $gte: cartItem.quantity } },
        { $inc: { stock: -cartItem.quantity } },
        { new: true }
      );
      if (!updated) stockErrors.push(cartItem.name);
    }

    if (stockErrors.length > 0) {
      // Roll back: cancel the order
      await Order.findByIdAndUpdate(order._id, { status: 'Cancelled' });
      return res.status(400).json({
        success: false,
        message: `Stock depleted for: ${stockErrors.join(', ')}. Order cancelled. Please refresh your cart.`,
      });
    }

    // 9. Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for logged-in user
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID (must belong to logged-in user)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found.' });
    }
    // Authorization guard — customers can only access their own orders
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This order does not belong to your account.',
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
