import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const VALID_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// --- DASHBOARD ---

export const getDashboard = async (req, res, next) => {
  try {
    const [
      totalProducts, totalCustomers, totalOrders, pendingOrders,
      deliveredOrders, lowStockProducts, outOfStockProducts, revenueResult,
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Delivered' }),
      Product.countDocuments({ stock: { $gt: 0, $lte: 3 } }),
      Product.countDocuments({ stock: 0 }),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const recentOrders = await Order.find().sort('-createdAt').limit(5).populate('user', 'name email');
    const lowStockItems = await Product.find({ stock: { $lte: 5 } }).select('name stock images category').sort('stock').limit(5);
    res.status(200).json({
      success: true,
      stats: { totalProducts, totalCustomers, totalOrders, pendingOrders, deliveredOrders, lowStockProducts, outOfStockProducts, totalRevenue },
      recentOrders,
      lowStockItems,
    });
  } catch (error) { next(error); }
};

// --- PRODUCTS ---

export const getAdminProducts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const query = {};
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { slug: new RegExp(search, 'i') }, { category: new RegExp(search, 'i') }, { brand: new RegExp(search, 'i') }];
    if (category && category !== 'all') query.categorySlug = category;
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([Product.find(query).sort(sort).skip(skip).limit(Number(limit)), Product.countDocuments(query)]);
    res.status(200).json({ success: true, products, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) || 1 });
  } catch (error) { next(error); }
};

export const getAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.status(200).json({ success: true, product });
  } catch (error) { next(error); }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, slug: reqSlug, description, category, categorySlug, subcategory, brand, price, originalPrice, discount, images, sizes, colors, stock, isFeatured, isNewArrival, isDeal, badge, highlights, specifications } = req.body;
    if (!name || !description || !category || price === undefined || price === null)
      return res.status(400).json({ success: false, message: 'name, description, category, and price are required.' });
    if (Number(price) < 0) return res.status(400).json({ success: false, message: 'Price cannot be negative.' });
    if (stock !== undefined && Number(stock) < 0) return res.status(400).json({ success: false, message: 'Stock cannot be negative.' });
    if (discount !== undefined && (Number(discount) < 0 || Number(discount) > 100)) return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100.' });
    if (!images || !Array.isArray(images) || images.length === 0) return res.status(400).json({ success: false, message: 'At least one product image URL is required.' });
    const finalSlug = reqSlug ? reqSlug.toLowerCase().trim() : slugify(name);
    const existingSlug = await Product.findOne({ slug: finalSlug });
    if (existingSlug) return res.status(400).json({ success: false, message: `Slug "${finalSlug}" is already in use.` });
    const product = await Product.create({
      name: name.trim(), slug: finalSlug, description: description.trim(),
      category: category.trim(), categorySlug: categorySlug ? categorySlug.toLowerCase().trim() : slugify(category),
      subcategory: subcategory?.trim() || '', brand: brand?.trim() || 'House of RCR',
      price: Number(price), originalPrice: originalPrice !== undefined ? Number(originalPrice) : Number(price),
      discount: discount !== undefined ? Number(discount) : 0, images,
      sizes: sizes || ['S', 'M', 'L', 'XL'], colors: colors || [],
      stock: stock !== undefined ? Number(stock) : 0,
      isFeatured: Boolean(isFeatured), isNewArrival: Boolean(isNewArrival), isDeal: Boolean(isDeal),
      badge: badge || null, highlights: highlights || [], specifications: specifications || {},
    });
    res.status(201).json({ success: true, message: 'Product created successfully.', product });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'A product with this slug already exists.' });
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    const { name, slug, description, category, categorySlug, subcategory, brand, price, originalPrice, discount, images, sizes, colors, stock, isFeatured, isNewArrival, isDeal, badge, highlights, specifications } = req.body;
    if (price !== undefined && Number(price) < 0) return res.status(400).json({ success: false, message: 'Price cannot be negative.' });
    if (stock !== undefined && Number(stock) < 0) return res.status(400).json({ success: false, message: 'Stock cannot be negative.' });
    if (discount !== undefined && (Number(discount) < 0 || Number(discount) > 100)) return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100.' });
    if (images !== undefined && (!Array.isArray(images) || images.length === 0)) return res.status(400).json({ success: false, message: 'Product must have at least one image URL.' });
    if (slug && slug !== product.slug) {
      const existing = await Product.findOne({ slug, _id: { $ne: product._id } });
      if (existing) return res.status(400).json({ success: false, message: `Slug "${slug}" is already in use.` });
      product.slug = slug.toLowerCase().trim();
    }
    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (category !== undefined) { product.category = category.trim(); if (!categorySlug) product.categorySlug = slugify(category); }
    if (categorySlug !== undefined) product.categorySlug = categorySlug.toLowerCase().trim();
    if (subcategory !== undefined) product.subcategory = subcategory.trim();
    if (brand !== undefined) product.brand = brand.trim();
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (discount !== undefined) product.discount = Number(discount);
    if (images !== undefined) product.images = images;
    if (sizes !== undefined) product.sizes = sizes;
    if (colors !== undefined) product.colors = colors;
    if (stock !== undefined) product.stock = Number(stock);
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isNewArrival !== undefined) product.isNewArrival = Boolean(isNewArrival);
    if (isDeal !== undefined) product.isDeal = Boolean(isDeal);
    if (badge !== undefined) product.badge = badge;
    if (highlights !== undefined) product.highlights = highlights;
    if (specifications !== undefined) product.specifications = specifications;
    await product.save();
    res.status(200).json({ success: true, message: 'Product updated successfully.', product });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'A product with this slug already exists.' });
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.status(200).json({ success: true, message: `Product "${product.name}" deleted successfully.` });
  } catch (error) { next(error); }
};

// --- ORDERS ---

export const getAdminOrders = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([Order.find(query).populate('user', 'name email').sort(sort).skip(skip).limit(Number(limit)), Order.countDocuments(query)]);
    let result = orders;
    if (search) {
      const q = search.toLowerCase();
      result = orders.filter((o) => o.orderNumber?.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q) || o.user?.email?.toLowerCase().includes(q));
    }
    res.status(200).json({ success: true, orders: result, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) || 1 });
  } catch (error) { next(error); }
};

export const getAdminOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.status(200).json({ success: true, order });
  } catch (error) { next(error); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !VALID_STATUSES.includes(status))
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    order.status = status;
    await order.save();
    res.status(200).json({ success: true, message: `Order status updated to "${status}".`, order });
  } catch (error) { next(error); }
};

// --- CUSTOMERS ---

export const getAdminCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: 'customer' };
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([User.find(query).select('-password').sort('-createdAt').skip(skip).limit(Number(limit)), User.countDocuments(query)]);
    const ids = customers.map((c) => c._id);
    const orderCounts = await Order.aggregate([{ $match: { user: { $in: ids } } }, { $group: { _id: '$user', count: { $sum: 1 } } }]);
    const countMap = {};
    orderCounts.forEach((o) => { countMap[o._id.toString()] = o.count; });
    const enriched = customers.map((c) => ({ ...c.toObject(), orderCount: countMap[c._id.toString()] || 0 }));
    res.status(200).json({ success: true, customers: enriched, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) || 1 });
  } catch (error) { next(error); }
};

export const getAdminCustomer = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
    const orders = await Order.find({ user: customer._id }).sort('-createdAt').limit(10);
    res.status(200).json({ success: true, customer, orders });
  } catch (error) { next(error); }
};

// --- INVENTORY ---

export const getInventory = async (req, res, next) => {
  try {
    const { filter, page = 1, limit = 30 } = req.query;
    const query = {};
    if (filter === 'low') query.stock = { $gt: 0, $lte: 3 };
    else if (filter === 'out') query.stock = 0;
    else if (filter === 'in') query.stock = { $gt: 3 };
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total, outOfStock, lowStock, inStock] = await Promise.all([
      Product.find(query).select('name slug category stock price images isFeatured').sort('stock').skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
      Product.countDocuments({ stock: 0 }),
      Product.countDocuments({ stock: { $gt: 0, $lte: 3 } }),
      Product.countDocuments({ stock: { $gt: 3 } }),
    ]);
    res.status(200).json({ success: true, products, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) || 1, summary: { outOfStock, lowStock, inStock } });
  } catch (error) { next(error); }
};

export const updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || stock === null || isNaN(Number(stock))) return res.status(400).json({ success: false, message: 'Stock value is required.' });
    if (Number(stock) < 0) return res.status(400).json({ success: false, message: 'Stock cannot be negative.' });
    if (!Number.isInteger(Number(stock))) return res.status(400).json({ success: false, message: 'Stock must be a whole number.' });
    const product = await Product.findByIdAndUpdate(req.params.id, { stock: Number(stock) }, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.status(200).json({ success: true, message: `Stock updated to ${stock} for "${product.name}".`, product });
  } catch (error) { next(error); }
};
