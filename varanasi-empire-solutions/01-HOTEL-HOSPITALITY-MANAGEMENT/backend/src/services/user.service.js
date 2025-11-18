import { userRepository } from '../repositories/user.repository.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 */
const getUserById = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }
  return user;
};

/**
 * Get users by property
 * @param {string} propertyId - Property ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const getUsersByProperty = async (propertyId, options = {}) => {
  return await userRepository.findByProperty(propertyId, options);
};

/**
 * Update user
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>}
 */
const updateUser = async (userId, updateData) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }
  return await userRepository.update(userId, updateData);
};

/**
 * Delete user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
const deleteUser = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }
  return await userRepository.softDelete(userId);
};

/**
 * Get user stats
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 */
const getUserStats = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  return {
    userId: user.id,
    name: `${user.first_name} ${user.last_name}`,
    role: user.role,
    email: user.email,
    isActive: user.is_active,
    createdAt: user.created_at,
    lastLogin: user.last_login_at,
  };
};

export const userService = {
  getUserById,
  getUsersByProperty,
  updateUser,
  deleteUser,
  getUserStats,
};
