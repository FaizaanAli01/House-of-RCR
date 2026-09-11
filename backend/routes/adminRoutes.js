import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getDashboard,
  getAdminProducts, getAdminProduct, createProduct, updateProduct, deleteProduct,
  getAdminOrders, getAdminOrder, updateOrderStatus,
  getAdminCustomers, getAdminCustomer,
  getInventory, updateStock,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard', getDashboard);

// Products
router.route('/products').get(getAdminProducts).post(createProduct);
router.route('/products/:id').get(getAdminProduct).put(updateProduct).delete(deleteProduct);

// Orders
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrder);
router.put('/orders/:id/status', updateOrderStatus);

// Customers
router.get('/customers', getAdminCustomers);
router.get('/customers/:id', getAdminCustomer);

// Inventory
router.get('/inventory', getInventory);
router.put('/inventory/:id', updateStock);

export default router;
