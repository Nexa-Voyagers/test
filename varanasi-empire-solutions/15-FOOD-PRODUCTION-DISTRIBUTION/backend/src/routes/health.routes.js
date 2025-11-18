import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      service: 'Food Production & Distribution API',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      service: 'Food Production & Distribution API',
      status: 'unhealthy',
      error: error.message,
    });
  }
});

export default router;
