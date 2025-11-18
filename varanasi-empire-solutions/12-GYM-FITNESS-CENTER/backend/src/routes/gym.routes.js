import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({ success: true, data: [] });
}));

router.post('/', asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, message: 'gym created' });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json({ success: true, data: { id: req.params.id } });
}));

export default router;
