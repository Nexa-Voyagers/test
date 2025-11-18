import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

/**
 * Health check endpoint
 * GET /health
 */
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Hotel Management System API',
    version: '1.0.0',
  });
}));

export default router;
