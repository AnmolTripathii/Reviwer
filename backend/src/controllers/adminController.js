import Review from '../models/Review.js';
import Business from '../models/Business.js';
import User from '../models/User.js';
import { updateBusinessRating } from './reviewController.js';

// Get all pending reviews
export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('business', 'name category')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending reviews', error: error.message });
  }
};

// Approve review
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.status === 'approved') {
      return res.status(400).json({ message: 'Review already approved' });
    }

    review.status = 'approved';
    review.approvedAt = new Date();
    review.approvedBy = req.user._id;

    await review.save();

    // Update business rating
    await updateBusinessRating(review.business);

    res.json({
      message: 'Review approved successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving review', error: error.message });
  }
};

// Reject review
export const rejectReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = 'rejected';
    review.approvedBy = req.user._id;

    await review.save();

    res.json({
      message: 'Review rejected successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting review', error: error.message });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBusinesses = await Business.countDocuments();
    const totalReviews = await Review.countDocuments();
    const pendingReviews = await Review.countDocuments({ status: 'pending' });
    const approvedReviews = await Review.countDocuments({ status: 'approved' });
    const rejectedReviews = await Review.countDocuments({ status: 'rejected' });

    res.json({
      totalUsers,
      totalBusinesses,
      totalReviews,
      pendingReviews,
      approvedReviews,
      rejectedReviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Get all businesses (admin view)
export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching businesses', error: error.message });
  }
};

// Get all users (admin view)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
