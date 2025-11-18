import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken } from '../utils/jwt.js';
import { query } from '../config/database.js';
import { authRateLimiter } from '../config/rateLimiter.js';

const router = express.Router();

// Login
router.post('/login', authRateLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], validate, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const result = await query(
    'SELECT * FROM users WHERE email = $1 AND is_active = true',
    [email]
  );

  const user = result.rows[0];

  if (!user || !(await comparePassword(password, user.password_hash))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Generate token
  const token = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
    agency_id: user.agency_id,
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.full_name,
      },
    },
  });
}));

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').notEmpty(),
], validate, asyncHandler(async (req, res) => {
  const { email, password, full_name, agency_id } = req.body;

  const passwordHash = await hashPassword(password);

  const result = await query(
    'INSERT INTO users (email, password_hash, full_name, agency_id, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name',
    [email, passwordHash, full_name, agency_id, 'AGENT']
  );

  const user = result.rows[0];

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: user,
  });
}));

export default router;
