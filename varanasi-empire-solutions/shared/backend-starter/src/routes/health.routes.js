import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service is unhealthy
 */
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbStart = Date.now();
    await pool.query('SELECT 1');
    const dbDuration = Date.now() - dbStart;

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.API_VERSION || 'v1',
      checks: {
        database: {
          status: 'up',
          responseTime: `${dbDuration}ms`,
        },
        memory: {
          used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        },
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness check (K8s probe)
 *     tags: [Health]
 */
router.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).send('Ready');
  } catch (error) {
    res.status(503).send('Not Ready');
  }
});

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness check (K8s probe)
 *     tags: [Health]
 */
router.get('/live', (req, res) => {
  res.status(200).send('Live');
});

export default router;
