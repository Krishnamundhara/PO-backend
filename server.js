const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const companyRoutes = require('./routes/company');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://po-management-app.netlify.app', /\.netlify\.app$/, 'https://po-management.netlify.app'] 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded company logos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/company', companyRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Purchase Order API is running' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    apiVersion: '1.0.0'
  });
});

// Debug route for login
app.get('/api/auth/debug', (req, res) => {
  res.json({
    message: 'Auth system available',
    loginEndpoint: '/api/auth/login',
    method: 'POST',
    requiredFields: ['username', 'password']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
