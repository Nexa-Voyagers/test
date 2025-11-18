import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError, ConflictError, UnauthorizedError, ValidationError } from '../utils/errors.js';

/**
 * Register new staff member for a restaurant
 * @param {Object} userData - User data
 * @returns {Promise<Object>} User and tokens
 */
const register = async (userData) => {
  // Check if user already exists in restaurant
  const exists = await userRepository.existsInRestaurant(userData.restaurant_id, userData.email);
  if (exists) {
    throw new ConflictError('User with this email already exists in this restaurant');
  }

  // Validate password strength
  const passwordValidation = validatePasswordStrength(userData.password);
  if (!passwordValidation.isValid) {
    throw new ValidationError(passwordValidation.errors.map(err => ({
      field: 'password',
      message: err,
    })));
  }

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  // Create user
  const user = await userRepository.create({
    ...userData,
    password_hash: hashedPassword,
  });

  // Generate tokens
  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    restaurant_id: user.restaurant_id,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      role: user.role,
      restaurant_id: user.restaurant_id,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User and tokens
 */
const login = async (email, password) => {
  // Find user by email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if user is active
  if (!user.is_active) {
    throw new UnauthorizedError('Your account has been disabled. Please contact management.');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Update last login
  await userRepository.updateLastLogin(user.id);

  // Generate tokens
  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    restaurant_id: user.restaurant_id,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      role: user.role,
      restaurant_id: user.restaurant_id,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New access token
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new access token
    const tokenPayload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      restaurant_id: decoded.restaurant_id,
    };

    const accessToken = generateAccessToken(tokenPayload);

    return { accessToken };
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};

/**
 * Change password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  // Find user
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  // Validate new password
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    throw new ValidationError(passwordValidation.errors.map(err => ({
      field: 'password',
      message: err,
    })));
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await userRepository.updatePassword(userId, hashedPassword);
};

export const authService = {
  register,
  login,
  refreshAccessToken,
  changePassword,
};
