import { userRepository } from '../repositories/user.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Get current user profile
 * GET /api/v1/users/profile
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await userRepository.findById(req.user.id);

  if (!user) {
    throw new NotFoundError('User');
  }

  res.json({
    success: true,
    data: user,
  });
});

/**
 * Update user profile
 * PUT /api/v1/users/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await userRepository.update(req.user.id, req.body);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

/**
 * Get all users in property
 * GET /api/v1/users
 */
const getUsers = asyncHandler(async (req, res) => {
  const { limit = 10, offset = 0, role = null, search = null } = req.query;

  const result = await userRepository.findByProperty(req.user.property_id, {
    limit: parseInt(limit),
    offset: parseInt(offset),
    role,
    search,
  });

  res.json({
    success: true,
    data: result.users,
    pagination: {
      total: result.totalCount,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
});

/**
 * Get user by ID
 * GET /api/v1/users/:id
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userRepository.findById(req.params.id);

  if (!user) {
    throw new NotFoundError('User');
  }

  res.json({
    success: true,
    data: user,
  });
});

/**
 * Create new user
 * POST /api/v1/users
 */
const createUser = asyncHandler(async (req, res) => {
  const user = await userRepository.create({
    ...req.body,
    property_id: req.user.property_id,
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

/**
 * Soft delete user
 * DELETE /api/v1/users/:id
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await userRepository.findById(req.params.id);

  if (!user) {
    throw new NotFoundError('User');
  }

  await userRepository.softDelete(req.params.id);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

export const userController = {
  getCurrentUser,
  updateProfile,
  getUsers,
  getUserById,
  createUser,
  deleteUser,
};
