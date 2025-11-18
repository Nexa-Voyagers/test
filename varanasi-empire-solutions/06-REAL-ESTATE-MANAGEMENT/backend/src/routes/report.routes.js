import express from 'express';
const router = express.Router();
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../config/database.js';

router.get('/dashboard', asyncHandler(async (req, res) => {
  const stats = {
    total_properties: (await query('SELECT COUNT(*) FROM properties')).rows[0].count,
    total_enquiries: (await query('SELECT COUNT(*) FROM enquiries')).rows[0].count,
    total_deals: (await query('SELECT COUNT(*) FROM deals WHERE status = $1', ['CLOSED'])).rows[0].count,
    total_revenue: (await query('SELECT COALESCE(SUM(deal_amount), 0) FROM deals WHERE status = $1', ['CLOSED'])).rows[0].coalesce,
  };
  res.json({ success: true, data: stats });
}));

export default router;
