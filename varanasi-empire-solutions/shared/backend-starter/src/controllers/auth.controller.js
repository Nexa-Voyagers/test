import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Register new user
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  const result = await authService.register({
    email,
    password,
    full_name,
    phone,
  });

  logger.info(`New user registered: ${email}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

/**
 * Login user
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  logger.info(`User logged in: ${email}`);

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
 * Forgot password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.forgotPassword(email);

  res.json({
    success: true,
    message: 'Password reset instructions sent to your email',
  });
});

/**
 * Reset password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  await authService.resetPassword(token, newPassword);

  res.json({
    success: true,
    message: 'Password reset successfully',
  });
});

export const authController = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};
