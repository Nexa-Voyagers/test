import { userRepository } from '../repositories/user.repository.js';
import { AppError, NotFoundError, ConflictError } from '../utils/errors.js';
import { hashPassword } from '../utils/password.js';

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
const getUserById = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  // Remove sensitive data
  delete user.password_hash;
  return user;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user
 */
const updateProfile = async (userId, updateData) => {
  // Prevent updating sensitive fields
  const restrictedFields = ['password_hash', 'role', 'restaurant_id', 'email'];
  restrictedFields.forEach(field => {
    delete updateData[field];
  });

  const user = await userRepository.update(userId, updateData);
  if (!user) {
    throw new NotFoundError('User');
  }

  delete user.password_hash;
  return user;
};

/**
 * Get users by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Users and pagination info
 */
const getUsersByRestaurant = async (restaurantId, options = {}) => {
  const { users, totalCount } = await userRepository.findByRestaurant(restaurantId, options);

  // Remove password hashes
  users.forEach(user => {
    delete user.password_hash;
  });

  return {
    users,
    totalCount,
    page: Math.ceil((options.offset || 0) / (options.limit || 10)) + 1,
    limit: options.limit || 10,
  };
};

/**
 * Create user (admin/manager only)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async (userData) => {
  // Check if user already exists
  const exists = await userRepository.existsInRestaurant(userData.restaurant_id, userData.email);
  if (exists) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  const user = await userRepository.create({
    ...userData,
    password_hash: hashedPassword,
  });

  delete user.password_hash;
  return user;
};

/**
 * Disable user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
const disableUser = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  await userRepository.softDelete(userId);
};

/**
 * Get user statistics
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object>} User statistics
 */
const getStatistics = async (restaurantId) => {
  const { users: allUsers } = await userRepository.findByRestaurant(restaurantId, { limit: 1000, offset: 0 });

  const roleCount = {};
  allUsers.forEach(user => {
    roleCount[user.role] = (roleCount[user.role] || 0) + 1;
  });

  return {
    totalUsers: allUsers.length,
    activeUsers: allUsers.filter(u => u.is_active).length,
    roleCount,
  };
};

export const userService = {
  getUserById,
  updateProfile,
  getUsersByRestaurant,
  createUser,
  disableUser,
  getStatistics,
};
