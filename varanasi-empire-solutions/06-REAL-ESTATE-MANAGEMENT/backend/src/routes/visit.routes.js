import express from 'express';
const router = express.Router();
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../config/database.js';

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM site_visits ORDER BY visit_date DESC');
  res.json({ success: true, data: result.rows });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { property_id, customer_id, agent_id, visit_date, visit_time } = req.body;
  const result = await query(
    'INSERT INTO site_visits (property_id, customer_id, agent_id, visit_date, visit_time, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [property_id, customer_id, agent_id, visit_date, visit_time, 'SCHEDULED']
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

export default router;
