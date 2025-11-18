import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError, ConflictError, UnauthorizedError, ValidationError } from '../utils/errors.js';

/**
 * Register new staff member
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User and tokens
 */
const register = async (userData) => {
  const exists = await userRepository.exists(userData.email);
  if (exists) {
    throw new ConflictError('User with this email already exists');
  }

  const passwordValidation = validatePasswordStrength(userData.password);
  if (!passwordValidation.isValid) {
    throw new ValidationError(passwordValidation.errors.map(err => ({
      field: 'password',
      message: err,
    })));
  }

  const hashedPassword = await hashPassword(userData.password);

  const user = await userRepository.create({
    ...userData,
    password_hash: hashedPassword,
  });

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    property_id: user.property_id,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      role: user.role,
      property_id: user.property_id,
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
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.is_active) {
    throw new UnauthorizedError('Your account has been disabled');
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  await userRepository.updateLastLogin(user.id);

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    property_id: user.property_id,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      role: user.role,
      property_id: user.property_id,
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
    const decoded = verifyRefreshToken(refreshToken);

    const tokenPayload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      property_id: decoded.property_id,
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
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    throw new ValidationError(passwordValidation.errors.map(err => ({
      field: 'password',
      message: err,
    })));
  }

  const hashedPassword = await hashPassword(newPassword);
  await userRepository.updatePassword(userId, hashedPassword);
};

export const authService = {
  register,
  login,
  refreshAccessToken,
  changePassword,
};
