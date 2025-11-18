import express from 'express';
const router = express.Router();
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../config/database.js';

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT id, agent_name, phone, email, rera_id FROM agents WHERE is_active = true');
  res.json({ success: true, data: result.rows });
}));

router.post('/', asyncHandler(async (req, res) => {
  const { agent_name, phone, email, agency_id } = req.body;
  const result = await query(
    'INSERT INTO agents (agent_name, phone, email, agency_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [agent_name, phone, email, agency_id]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

export default router;
