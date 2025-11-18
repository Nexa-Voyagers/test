import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbCheck = await query('SELECT NOW()');

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Real Estate Management API',
      database: 'connected',
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'Real Estate Management API',
      database: 'disconnected',
      error: error.message,
    });
  }
});

export default router;
