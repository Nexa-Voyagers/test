import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';

class AuthService {
  async register(userData) {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('User already exists with this email', 409);
    }

    // Hash password
    userData.password_hash = await hashPassword(userData.password);
    delete userData.password;

    // Create user
    const user = await userRepository.create(userData);

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.school_id,
    });

    const refreshToken = generateRefreshToken({ id: user.id });

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AppError('Account is deactivated', 403);
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.school_id,
    });

    const refreshToken = generateRefreshToken({ id: user.id });

    // Update last login
    await userRepository.updateLastLogin(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        schoolId: user.school_id,
      },
      accessToken,
      refreshToken,
    };
  }

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    delete user.password_hash;
    return user;
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await userRepository.findById(decoded.id);

      if (!user || !user.is_active) {
        throw new AppError('Invalid refresh token', 401);
      }

      const newAccessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.school_id,
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isValid = await comparePassword(currentPassword, user.password_hash);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await userRepository.updatePassword(userId, newPasswordHash);
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token (in production, store in DB with expiry)
    const resetToken = generateAccessToken({ id: user.id, type: 'reset' });

    // Send email with reset link (implement email service)
    // await emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(token, newPassword) {
    // Verify reset token
    // In production, verify token from DB
    // const decoded = verifyAccessToken(token);

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    // await userRepository.updatePassword(decoded.id, passwordHash);
  }
}

export const authService = new AuthService();
