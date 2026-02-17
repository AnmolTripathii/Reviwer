import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection function (persistent for server lifetime)
const connectDB = async () => {
  try {
    // Read URI from env, trim surrounding quotes if present

    

    // Connect and keep the connection open for the app lifetime
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reviwer')
    console.log('MONGOOSE CONNECTED TO', conn.connection.host)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Crowdsourced Review Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      businesses: '/api/businesses',
      reviews: '/api/reviews',
      admin: '/api/admin'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server function
const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server due to DB error:', err)
    process.exit(1)
  }
}

// Start the application //
startServer()
