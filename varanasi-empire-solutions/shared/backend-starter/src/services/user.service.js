import { userRepository } from '../repositories/user.repository.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Get user by ID
 */
const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError('User');
  }

  // Remove password from response
  delete user.password;

  return user;
};

/**
 * Get all users with pagination and search
 */
const getAllUsers = async ({ page, limit, search }) => {
  const offset = (page - 1) * limit;

  const { users, totalCount } = await userRepository.findAll({
    limit,
    offset,
    search,
  });

  // Remove passwords from response
  users.forEach(user => delete user.password);

  return {
    users,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalRecords: totalCount,
  };
};

/**
 * Update user
 */
const updateUser = async (id, updateData) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError('User');
  }

  // Don't allow password update through this method
  delete updateData.password;
  delete updateData.role; // Role changes require special authorization

  const updatedUser = await userRepository.update(id, updateData);

  // Remove password from response
  delete updatedUser.password;

  return updatedUser;
};

/**
 * Delete user (soft delete)
 */
const deleteUser = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError('User');
  }

  await userRepository.softDelete(id);
};

export const userService = {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
