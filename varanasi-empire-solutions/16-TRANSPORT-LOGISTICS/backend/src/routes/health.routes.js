import express from 'express';
import { pool } from '../config/database.js';
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ success: true, service: 'Transport & Logistics API', status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ success: false, status: 'unhealthy', error: error.message });
  }
});
export default router;
