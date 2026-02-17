import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    // Support structured ratings (quality/service/value) and computed average
    quality: { type: Number, min: 1, max: 5, required: false },
    service: { type: Number, min: 1, max: 5, required: false },
    value: { type: Number, min: 1, max: 5, required: false },
    average: { type: Number, min: 1, max: 5, required: false }
  },
  category: {
    type: String,
    trim: true,
    required: false,
  },
  photos: [
    {
      url: String,
      public_id: String
    }
  ],
  comment: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Ensure one review per user per business
reviewSchema.index({ business: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
