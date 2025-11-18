import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { UnauthorizedError, ValidationError } from '../utils/errors.js';
import { logger } from '../config/logger.js';

/**
 * Login
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ValidationError([
      { field: 'credentials', message: 'Username and password are required' },
    ]);
  }

  // Find user
  const user = await userRepository.findByUsername(username);
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Check if user is active
  if (!user.is_active) {
    throw new UnauthorizedError('Account is inactive');
  }

  // Generate tokens
  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role,
    hospital_id: user.hospital_id,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  logger.info(`User logged in: ${user.username}`);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        hospital_id: user.hospital_id,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      token,
      refreshToken,
    },
  });
});

/**
 * Register
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, ...userData } = req.body;

  // Check if user already exists
  const existingUser = await userRepository.findByUsername(username);
  if (existingUser) {
    throw new ValidationError([{ field: 'username', message: 'Username already exists' }]);
  }

  const existingEmail = await userRepository.findByEmail(email);
  if (existingEmail) {
    throw new ValidationError([{ field: 'email', message: 'Email already exists' }]);
  }

  // Hash password
  const password_hash = await hashPassword(password);

  // Create user
  const user = await userRepository.create({
    username,
    email,
    password_hash,
    ...userData,
  });

  logger.info(`New user registered: ${user.username}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    },
  });
});

/**
 * Get current user
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await userRepository.findById(req.user.id);

  res.json({
    success: true,
    data: user,
  });
});

export default { login, register, getMe };
