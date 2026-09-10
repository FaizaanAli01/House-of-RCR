import express from 'express';
import {
  getProfile,
  updateProfile,
  updateAddress,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // all user routes are protected

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/address', updateAddress);

export default router;
