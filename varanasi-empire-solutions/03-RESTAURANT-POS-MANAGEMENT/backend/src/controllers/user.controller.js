import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Get current user profile
 * GET /api/users/me
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  res.json({
    success: true,
    data: user,
  });
});

/**
 * Update user profile
 * PATCH /api/users/me
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { first_name, last_name, phone } = req.body;

  const user = await userService.updateProfile(req.user.id, {
    first_name,
    last_name,
    phone,
  });

  logger.info(`Profile updated for user: ${req.user.id}`);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

/**
 * Get user by ID
 * GET /api/users/:id
 */
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userService.getUserById(id);

  res.json({
    success: true,
    data: user,
  });
});

/**
 * Get restaurant users
 * GET /api/users
 */
const getRestaurantUsers = asyncHandler(async (req, res) => {
  const { limit = 10, offset = 0, role, search } = req.query;

  const result = await userService.getUsersByRestaurant(req.user.restaurant_id, {
    limit: parseInt(limit),
    offset: parseInt(offset),
    role,
    search,
  });

  res.json({
    success: true,
    data: result,
  });
});

/**
 * Create new user (Admin/Manager only)
 * POST /api/users
 */
const createUser = asyncHandler(async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    role,
    employee_id,
    joining_date,
  } = req.body;

  const user = await userService.createUser({
    restaurant_id: req.user.restaurant_id,
    first_name,
    last_name,
    email,
    phone,
    password,
    role,
    employee_id,
    joining_date,
  });

  logger.info(`New user created: ${email} by ${req.user.id}`);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

/**
 * Update user details (Admin/Manager only)
 * PATCH /api/users/:id
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone, role, is_active } = req.body;

  const user = await userService.updateProfile(id, {
    first_name,
    last_name,
    phone,
    role,
    is_active,
  });

  logger.info(`User updated: ${id} by ${req.user.id}`);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

/**
 * Disable user (Admin/Manager only)
 * DELETE /api/users/:id
 */
const disableUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await userService.disableUser(id);

  logger.info(`User disabled: ${id} by ${req.user.id}`);

  res.json({
    success: true,
    message: 'User disabled successfully',
  });
});

/**
 * Get user statistics
 * GET /api/users/stats/summary
 */
const getStatistics = asyncHandler(async (req, res) => {
  const stats = await userService.getStatistics(req.user.restaurant_id);

  res.json({
    success: true,
    data: stats,
  });
});

export const userController = {
  getProfile,
  updateProfile,
  getUser,
  getRestaurantUsers,
  createUser,
  updateUser,
  disableUser,
  getStatistics,
};
