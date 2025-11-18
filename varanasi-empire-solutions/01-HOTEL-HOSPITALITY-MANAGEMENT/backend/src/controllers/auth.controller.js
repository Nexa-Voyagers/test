import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Register new staff member
 * POST /api/v1/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const {
    property_id,
    first_name,
    last_name,
    email,
    phone,
    password,
    role,
    department,
  } = req.body;

  const result = await authService.register({
    property_id,
    first_name,
    last_name,
    email,
    phone,
    password,
    role,
    department,
  });

  logger.info(`New staff member registered: ${email} for property ${property_id}`);

  res.status(201).json({
    success: true,
    message: 'Staff member registered successfully',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

/**
 * Login staff member
 * POST /api/v1/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  logger.info(`Staff member logged in: ${email}`);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await authService.refreshAccessToken(refreshToken);

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken: result.accessToken,
    },
  });
});

/**
 * Change password
 * POST /api/v1/auth/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  await authService.changePassword(userId, currentPassword, newPassword);

  logger.info(`Password changed for user: ${userId}`);

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * Logout
 * POST /api/v1/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  logger.info(`User logged out: ${req.user.id}`);

  res.json({
    success: true,
    message: 'Logout successful',
  });
});

export const authController = {
  register,
  login,
  refreshToken,
  changePassword,
  logout,
};
