import express from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import storeRoutes from './store.routes.js';
import weaverRoutes from './weaver.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import customerRoutes from './customer.routes.js';
import saleRoutes from './sale.routes.js';
import purchaseRoutes from './purchase.routes.js';
import customOrderRoutes from './custom-order.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = express.Router();

/**
 * Health check routes (public)
 */
router.use('/health', healthRoutes);

/**
 * Authentication routes (public)
 */
router.use('/auth', authRoutes);

/**
 * API v1 routes (protected)
 */
router.use('/v1/stores', storeRoutes);
router.use('/v1/weavers', weaverRoutes);
router.use('/v1/categories', categoryRoutes);
router.use('/v1/products', productRoutes);
router.use('/v1/customers', customerRoutes);
router.use('/v1/sales', saleRoutes);
router.use('/v1/purchases', purchaseRoutes);
router.use('/v1/custom-orders', customOrderRoutes);
router.use('/v1/analytics', analyticsRoutes);

/**
 * Root endpoint
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Saree & Textile Store Management API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      stores: '/api/v1/stores',
      weavers: '/api/v1/weavers',
      categories: '/api/v1/categories',
      products: '/api/v1/products',
      customers: '/api/v1/customers',
      sales: '/api/v1/sales',
      purchases: '/api/v1/purchases',
      customOrders: '/api/v1/custom-orders',
      analytics: '/api/v1/analytics'
    }
  });
});

export default router;
