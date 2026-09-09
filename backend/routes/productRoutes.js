import express from 'express';
import {
  getProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getDealProducts,
  getNewArrivals,
  checkProductStock,
} from '../controllers/productController.js';
import {
  validateProductId,
  validateProductQuery,
  validateStockCheck,
} from '../middleware/validator.js';

const router = express.Router();

// Specific routes before param :id
router.get('/featured', getFeaturedProducts);
router.get('/deals', getDealProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/category/:category', getProductsByCategory);
router.post('/check-stock', validateStockCheck, checkProductStock);

// General collection & single item routes
router.route('/').get(validateProductQuery, getProducts);
router.route('/:id').get(validateProductId, getProductById);

export default router;
