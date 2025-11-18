import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../services/auth.service.js';
import { AppError } from '../utils/errors.js';

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const userData = req.body;
  const result = await authService.register(userData);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const result = await authService.login(email, password);

  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await authService.getMe(userId);

  res.json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token required', 400);
  }

  const result = await authService.refreshToken(refreshToken);

  res.json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // In a real implementation, invalidate token in Redis/DB
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

/**
 * @desc    Change password
 * @route   POST /api/v1/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  await authService.changePassword(userId, currentPassword, newPassword);

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.forgotPassword(email);

  res.json({
    success: true,
    message: 'Password reset link sent to email',
  });
});

/**
 * @desc    Reset password
 * @route   POST /api/v1/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  await authService.resetPassword(token, password);

  res.json({
    success: true,
    message: 'Password reset successful',
  });
});
