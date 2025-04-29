const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

// Import routes
const nftRoutes = require('./routes/nfts');
const tokenRoutes = require('./routes/tokens');
const userRoutes = require('./routes/users');
const vulnerableRoutes = require('./routes/vulnerable');

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nebulax',
});

// Make db available to routes
app.locals.db = pool;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/nfts', nftRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/users', userRoutes);
app.use('/api', vulnerableRoutes); // Intentionally vulnerable routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'NebulaX Backend API',
    version: '1.0.0',
    endpoints: [
      '/api/nfts - NFT operations',
      '/api/tokens - Token operations',
      '/api/users - User operations',
      '/api/submitMemo - Vulnerable to SQL injection',
      '/api/fetchPrice - Vulnerable to SSRF'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 