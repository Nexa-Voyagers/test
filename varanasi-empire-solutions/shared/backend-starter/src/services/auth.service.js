import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError, ConflictError, UnauthorizedError, ValidationError } from '../utils/errors.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Register new user
 */
const register = async (userData) => {
  // Check if user already exists
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
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
    password: hashedPassword,
    role: 'customer', // Default role
  });

  // Generate tokens
  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Remove password from response
  delete user.password;

  return {
    user,
    accessToken,
    refreshToken,
  };
};

/**
 * Login user
 */
const login = async (email, password) => {
  // Find user by email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if user is active
  if (!user.is_active) {
    throw new UnauthorizedError('Account is disabled. Please contact support.');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
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
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Remove password from response
  delete user.password;

  return {
    user,
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token
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
    };

    const accessToken = generateAccessToken(tokenPayload);

    return { accessToken };
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};

/**
 * Forgot password
 */
const forgotPassword = async (email) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // Don't reveal if email exists
    return;
  }

  // Generate reset token (in production, save this to database with expiry)
  const resetToken = uuidv4();

  // In production: Send email with reset link
  // await emailService.sendPasswordResetEmail(user.email, resetToken);

  // For now, just log it (REMOVE IN PRODUCTION)
  console.log(`Password reset token for ${email}: ${resetToken}`);
};

/**
 * Reset password
 */
const resetPassword = async (token, newPassword) => {
  // In production: Verify token from database
  // For now, this is a placeholder

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

  // Update password (this is a placeholder - needs token verification)
  // await userRepository.updatePassword(userId, hashedPassword);

  throw new AppError('Password reset not fully implemented yet', 501);
};

export const authService = {
  register,
  login,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
};
