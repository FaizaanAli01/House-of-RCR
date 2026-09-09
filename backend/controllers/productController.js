import mongoose from 'mongoose';
import Product from '../models/Product.js';
import APIFeatures from '../utils/apiFeatures.js';

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const resPerPage = Number(req.query.limit) || 50;
    const totalProducts = await Product.countDocuments();

    // Instantiate APIFeatures with query
    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter();

    // Count matching products before pagination
    const countQuery = apiFeatures.query.clone();
    const filteredProductsCount = await countQuery.countDocuments();

    // Apply sort & pagination
    apiFeatures.sort().paginate(resPerPage);
    const products = await apiFeatures.query;

    const page = Number(req.query.page) || 1;
    const totalPages = Math.ceil(filteredProductsCount / resPerPage) || 1;

    res.status(200).json({
      success: true,
      totalProducts,
      filteredProductsCount,
      count: products.length,
      page,
      totalPages,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = null;

    // 1. Try finding by MongoDB ObjectId if valid
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    // 2. If not found, try finding by slug
    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    // 3. If still not found, try matching custom id format (e.g. 'rcr-001')
    if (!product) {
      product = await Product.findOne({
        $or: [
          { slug: new RegExp(`^${id}$`, 'i') },
          { name: new RegExp(`^${id}$`, 'i') },
        ],
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with identifier: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      product,
      stockStatus: {
        inStock: product.stock > 0,
        isLowStock: product.stock > 0 && product.stock <= 3,
        availableStock: product.stock,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category slug
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const categoryQuery = {
      $or: [
        { categorySlug: category.toLowerCase() },
        { category: new RegExp(category, 'i') },
      ],
    };

    const products = await Product.find(categoryQuery).sort('-isFeatured -createdAt');

    res.status(200).json({
      success: true,
      category,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products for homepage
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isFeatured: true })
      .sort('-rating -createdAt')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get deal products for homepage / shop
// @route   GET /api/products/deals
// @access  Public
export const getDealProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isDeal: true })
      .sort('-discount -createdAt')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new arrival products
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isNewArrival: true })
      .sort('-createdAt')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check inventory / stock availability for requested items
// @route   POST /api/products/check-stock
// @access  Public
export const checkProductStock = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    let product = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    } else {
      product = await Product.findOne({
        $or: [{ slug: productId.toLowerCase() }, { _id: productId }],
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found`,
      });
    }

    const isAvailable = product.stock >= quantity;
    const isOutOfStock = product.stock === 0;

    let message = 'In stock';
    if (isOutOfStock) {
      message = 'Product is currently Out of Stock';
    } else if (!isAvailable) {
      message = `Only ${product.stock} units available in stock. Cannot fulfill request of ${quantity}.`;
    }

    res.status(200).json({
      success: true,
      productId: product._id,
      productName: product.name,
      availableStock: product.stock,
      requestedQuantity: quantity,
      isAvailable,
      isOutOfStock,
      isLowStock: product.stock > 0 && product.stock <= 3,
      message,
    });
  } catch (error) {
    next(error);
  }
};
