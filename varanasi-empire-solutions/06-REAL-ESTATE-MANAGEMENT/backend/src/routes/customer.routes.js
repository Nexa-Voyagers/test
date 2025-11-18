import express from 'express';
const router = express.Router();
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../config/database.js';

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM customers ORDER BY created_at DESC LIMIT 50');
  res.json({ success: true, data: result.rows });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { customer_name, phone, email, budget_min, budget_max, preferred_location } = req.body;
  const result = await query(
    'INSERT INTO customers (customer_name, phone, email, budget_min, budget_max, preferred_location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [customer_name, phone, email, budget_min, budget_max, preferred_location]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

export default router;
