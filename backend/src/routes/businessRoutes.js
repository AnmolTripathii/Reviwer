import express from 'express';
import {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness
} from '../controllers/businessController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBusinesses);
router.get('/:id', getBusinessById);

// Protected routes
router.post('/', authenticate, createBusiness);
router.put('/:id', authenticate, updateBusiness);
router.delete('/:id', authenticate, deleteBusiness);

export default router;
