import Review from '../models/Review.js';
import Business from '../models/Business.js';

// Create new review
export const createReview = async (req, res) => {
  try {
    const { businessId, rating, comment } = req.body;

    // Check if business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Check if user already reviewed this business
    const existingReview = await Review.findOne({
      business: businessId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this business' });
    }

    const review = new Review({
      business: businessId,
      user: req.user._id,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({
      message: 'Review submitted successfully. Pending admin approval.',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

// Get reviews for a business
export const getReviewsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { status = 'approved' } = req.query;

    const query = { business: businessId };
    
    // Only show approved reviews to non-admin users
    if (req.user?.role !== 'admin') {
      query.status = 'approved';
    } else if (status) {
      query.status = status;
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('business', 'name category')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reviews', error: error.message });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the review author
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.status = 'pending'; // Reset to pending after update

    await review.save();

    res.json({
      message: 'Review updated successfully. Pending admin approval.',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the review author or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update business rating
    await updateBusinessRating(review.business);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

// Helper function to update business rating
const updateBusinessRating = async (businessId) => {
  const reviews = await Review.find({ business: businessId, status: 'approved' });
  
  if (reviews.length === 0) {
    await Business.findByIdAndUpdate(businessId, {
      averageRating: 0,
      totalReviews: 0
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Business.findByIdAndUpdate(businessId, {
    averageRating: averageRating.toFixed(2),
    totalReviews: reviews.length
  });
};

export { updateBusinessRating };
