import express from 'express';
const router = express.Router();
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../config/database.js';

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM commissions ORDER BY created_at DESC');
  res.json({ success: true, data: result.rows });
}));

router.get('/agent/:agentId', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM commissions WHERE agent_id = $1', [req.params.agentId]);
  res.json({ success: true, data: result.rows });
}));

export default router;
