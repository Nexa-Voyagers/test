import express from 'express';
const router = express.Router();
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../config/database.js';

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM agencies WHERE is_active = true');
  res.json({ success: true, data: result.rows });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { agency_name, rera_registration_number } = req.body;
  const result = await query(
    'INSERT INTO agencies (agency_name, rera_registration_number) VALUES ($1, $2) RETURNING *',
    [agency_name, rera_registration_number]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

export default router;
