import express from 'express';
import {
  createReview,
  getReviewsByBusiness,
  getUserReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', authenticate, createReview);
router.get('/business/:businessId', getReviewsByBusiness);
router.get('/user', authenticate, getUserReviews);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
