import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken } from '../utils/jwt.js';
import { query } from '../config/database.js';

const router = express.Router();

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], validate, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  
  if (!user || !(await comparePassword(password, user.password_hash))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  const token = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  res.json({ success: true, data: { token, user: { id: user.id, email: user.email } } });
}));

export default router;
