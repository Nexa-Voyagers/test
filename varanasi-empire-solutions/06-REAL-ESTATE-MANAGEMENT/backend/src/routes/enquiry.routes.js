import express from 'express';
const router = express.Router();
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../config/database.js';

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 100');
  res.json({ success: true, data: result.rows });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { property_id, customer_id, enquiry_type, message } = req.body;
  const result = await query(
    'INSERT INTO enquiries (property_id, customer_id, enquiry_type, message, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [property_id, customer_id, enquiry_type, message, 'OPEN']
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

router.patch('/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body;
  const result = await query(
    'UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING *',
    [status, req.params.id]
  );
  res.json({ success: true, data: result.rows[0] });
}));

export default router;
