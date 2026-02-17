import express from 'express';
import {
  getPendingReviews,
  approveReview,
  rejectReview,
  getDashboardStats,
  getAllBusinesses,
  getAllUsers
} from '../controllers/adminController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, isAdmin);

router.get('/reviews/pending', getPendingReviews);
router.put('/reviews/:id/approve', approveReview);
router.put('/reviews/:id/reject', rejectReview);
router.get('/stats', getDashboardStats);
router.get('/businesses', getAllBusinesses);
router.get('/users', getAllUsers);

export default router;
