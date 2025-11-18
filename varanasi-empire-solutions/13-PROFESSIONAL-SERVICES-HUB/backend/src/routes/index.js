import express from 'express';

// Import all route modules
import firmRoutes from './firm.routes.js';
import professionalsRoutes from './professionals.routes.js';
import clientsRoutes from './clients.routes.js';
import casesRoutes from './cases.routes.js';
import hearingsRoutes from './hearings.routes.js';
import invoicesRoutes from './invoices.routes.js';
import documentsRoutes from './documents.routes.js';
import analyticsRoutes from './analytics.routes.js';
import healthRoutes from './health.routes.js';

/**
 * Main API Router
 * Registers all API routes with versioning
 */
const router = express.Router();

/**
 * Health Check Routes
 * @route /api/v1/health
 */
router.use('/health', healthRoutes);

/**
 * Service Firm Routes
 * @route /api/v1/firms
 */
router.use('/firms', firmRoutes);

/**
 * Professional Routes
 * @route /api/v1/professionals
 */
router.use('/professionals', professionalsRoutes);

/**
 * Client Routes
 * @route /api/v1/clients
 */
router.use('/clients', clientsRoutes);

/**
 * Case Routes
 * @route /api/v1/cases
 */
router.use('/cases', casesRoutes);

/**
 * Hearing Routes
 * @route /api/v1/hearings
 */
router.use('/hearings', hearingsRoutes);

/**
 * Invoice Routes
 * @route /api/v1/invoices
 */
router.use('/invoices', invoicesRoutes);

/**
 * Document Routes
 * @route /api/v1/documents
 */
router.use('/documents', documentsRoutes);

/**
 * Analytics Routes
 * @route /api/v1/analytics
 */
router.use('/analytics', analyticsRoutes);

/**
 * API Info Route
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Professional Services Hub API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      firms: '/api/v1/firms',
      professionals: '/api/v1/professionals',
      clients: '/api/v1/clients',
      cases: '/api/v1/cases',
      hearings: '/api/v1/hearings',
      invoices: '/api/v1/invoices',
      documents: '/api/v1/documents',
      analytics: '/api/v1/analytics',
      documentation: '/api-docs',
    },
  });
});

export default router;
