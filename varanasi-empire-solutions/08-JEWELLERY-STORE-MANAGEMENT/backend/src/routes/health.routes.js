import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      message: 'Jewellery Store Management System API is healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({ success: false, message: 'Service unhealthy', error: error.message });
  }
});

export default router;
