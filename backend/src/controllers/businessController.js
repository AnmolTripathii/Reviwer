import Business from '../models/Business.js';
import Review from '../models/Review.js';

// Create new business
export const createBusiness = async (req, res) => {
  try {
    const { name, category, description, address, location, contact } = req.body;

    const business = new Business({
      name,
      category,
      description,
      address,
      location,
      contact,
      createdBy: req.user._id
    });

    await business.save();

    res.status(201).json({
      message: 'Business created successfully',
      business
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating business', error: error.message });
  }
};

// Get all businesses with filters
export const getBusinesses = async (req, res) => {
  try {
    const { category, search, sortBy = 'createdAt' } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions.averageRating = -1;
    } else if (sortBy === 'reviews') {
      sortOptions.totalReviews = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const businesses = await Business.find(query)
      .sort(sortOptions)
      .populate('createdBy', 'name email');

    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching businesses', error: error.message });
  }
};

// Get business by ID
export const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching business', error: error.message });
  }
};

// Update business
export const updateBusiness = async (req, res) => {
  try {
    const { name, category, description, address, location, contact } = req.body;
    
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Check if user is the creator or admin
    if (business.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    business.name = name || business.name;
    business.category = category || business.category;
    business.description = description || business.description;
    business.address = address || business.address;
    business.location = location || business.location;
    business.contact = contact || business.contact;

    await business.save();

    res.json({
      message: 'Business updated successfully',
      business
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating business', error: error.message });
  }
};

// Delete business
export const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Check if user is the creator or admin
    if (business.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Business.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ business: req.params.id });

    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting business', error: error.message });
  }
};
