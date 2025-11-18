import express from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import companyRoutes from './company.routes.js';
import clientRoutes from './client.routes.js';
import eventRoutes from './event.routes.js';
import vendorRoutes from './vendor.routes.js';
import taskRoutes from './task.routes.js';
import paymentRoutes from './payment.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = express.Router();

/**
 * API Routes Configuration
 * Version: v1
 */

// Health check (no auth required)
router.use('/health', healthRoutes);

// Authentication routes (no auth required)
router.use('/auth', authRoutes);

// Main API routes (auth required)
router.use('/companies', companyRoutes);
router.use('/clients', clientRoutes);
router.use('/events', eventRoutes);
router.use('/vendors', vendorRoutes);
router.use('/tasks', taskRoutes);
router.use('/payments', paymentRoutes);
router.use('/analytics', analyticsRoutes);

// API Info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Event & Wedding Planning Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      companies: '/api/companies',
      clients: '/api/clients',
      events: '/api/events',
      vendors: '/api/vendors',
      tasks: '/api/tasks',
      payments: '/api/payments',
      analytics: '/api/analytics',
    },
  });
});

export default router;
