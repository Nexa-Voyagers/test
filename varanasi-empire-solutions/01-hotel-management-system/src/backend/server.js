/**
 * HOTEL MANAGEMENT SYSTEM - API SERVER
 * Version: 1.0.0
 * Author: Nexavoyagers Development Team
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const propertyRoutes = require('./routes/property.routes');
const reservationRoutes = require('./routes/reservation.routes');
const guestRoutes = require('./routes/guest.routes');
const roomRoutes = require('./routes/room.routes');
const billingRoutes = require('./routes/billing.routes');
const housekeepingRoutes = require('./routes/housekeeping.routes');
const reviewRoutes = require('./routes/review.routes');
const channelRoutes = require('./routes/channel.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const authRoutes = require('./routes/auth.routes');

// Import middlewares
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Database connection
const db = require('./config/database');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/guests', guestRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/housekeeping', housekeepingRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/channels', channelRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// ============================================================================
// DATABASE & SERVER STARTUP
// ============================================================================

// Test database connection
db.authenticate()
  .then(() => {
    logger.info('✓ Database connection established successfully');

    // Start server
    app.listen(PORT, () => {
      logger.info(`✓ HMS API Server running on port ${PORT}`);
      logger.info(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`✓ Access: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('✗ Unable to connect to the database:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    db.close();
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
