import express from 'express';
const router = express.Router();
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../config/database.js';

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM deals ORDER BY deal_date DESC');
  res.json({ success: true, data: result.rows });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { property_id, customer_id, agent_id, deal_amount, commission_amount } = req.body;
  const result = await query(
    'INSERT INTO deals (property_id, customer_id, agent_id, deal_amount, commission_amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [property_id, customer_id, agent_id, deal_amount, commission_amount, 'IN_PROGRESS']
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

export default router;
