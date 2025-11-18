import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessToken } from '../utils/jwt.js';
const router = express.Router();

router.post('/login', asyncHandler(async (req, res) => {
  const token = generateAccessToken({ id: '1', email: req.body.email });
  res.json({ success: true, data: { token } });
}));

export default router;
