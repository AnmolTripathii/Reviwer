import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '8.8.8.8']);
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - configure CORS to allow Authorization header and common methods
app.use(cors({
  origin: true, // reflect request origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
// Add explicit CORS headers and handle preflight requests
app.use((req, res, next) => {
  const origin = req.headers.origin || '*'
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
  res.header('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

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
app.use('/api/upload', uploadRoutes);

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
// Multer error handling and general error handler
app.use((err, req, res, next) => {
  // Multer error
  if (err && err.name === 'MulterError') {
    console.error('Multer error:', err)
    return res.status(400).json({ message: err.message })
  }

  console.error(err && err.stack ? err.stack : err)
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? (err && err.message) : {}
  })
})

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
