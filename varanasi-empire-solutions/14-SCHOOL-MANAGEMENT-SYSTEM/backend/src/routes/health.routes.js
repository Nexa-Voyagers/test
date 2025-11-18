import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

/**
 * @desc    Health check endpoint
 * @route   GET /health
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbStart = Date.now();
    await pool.query('SELECT 1');
    const dbDuration = Date.now() - dbStart;

    res.json({
      success: true,
      message: 'School Management System API is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: 'connected',
        responseTime: `${dbDuration}ms`,
      },
      memory: process.memoryUsage(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service unhealthy',
      error: error.message,
    });
  }
});

export default router;
