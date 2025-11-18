import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../config/database.js';
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM reports LIMIT 50');
  res.json({ success: true, data: result.rows });
}));

router.post('/', asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, message: 'report created' });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { id: req.params.id } });
}));

export default router;
