import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get current user profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  res.json({
    success: true,
    data: { user },
  });
});

/**
 * Update current user profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.user.id, req.body);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});

/**
 * Get all users (Admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  const result = await userService.getAllUsers({
    page: parseInt(page),
    limit: parseInt(limit),
    search,
  });

  res.json({
    success: true,
    data: result.users,
    pagination: {
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      totalRecords: result.totalRecords,
    },
  });
});

/**
 * Get user by ID (Admin)
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.json({
    success: true,
    data: { user },
  });
});

/**
 * Update user (Admin)
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user },
  });
});

/**
 * Delete user (Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

export const userController = {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
