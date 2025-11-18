import { asyncHandler } from '../utils/asyncHandler.js';
import { userService } from '../services/user.service.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role } = req.query;
  const schoolId = req.user.schoolId;

  const result = await userService.getAllUsers(schoolId, {
    page: parseInt(page),
    limit: parseInt(limit),
    role,
  });

  res.json({
    success: true,
    data: result.users,
    pagination: result.pagination,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userService.getUserById(id);

  res.json({
    success: true,
    data: user,
  });
});

export const createUser = asyncHandler(async (req, res) => {
  const userData = req.body;
  const schoolId = req.user.schoolId;

  const user = await userService.createUser({ ...userData, schoolId });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const user = await userService.updateUser(id, updateData);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await userService.deleteUser(id);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});
