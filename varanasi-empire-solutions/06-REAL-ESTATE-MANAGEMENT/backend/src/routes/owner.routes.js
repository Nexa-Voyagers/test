import express from 'express';
const router = express.Router();
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../config/database.js';

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM owners ORDER BY created_at DESC');
  res.json({ success: true, data: result.rows });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { owner_name, phone, email, address } = req.body;
  const result = await query(
    'INSERT INTO owners (owner_name, phone, email, address) VALUES ($1, $2, $3, $4) RETURNING *',
    [owner_name, phone, email, address]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

export default router;
