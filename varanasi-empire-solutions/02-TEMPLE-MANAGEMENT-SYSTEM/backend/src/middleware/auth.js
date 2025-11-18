import { verifyToken } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { userRepository } from '../repositories/user.repository.js';

/**
 * Authentication middleware
 */
export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('Not authorized to access this route');
  }

  try {
    const decoded = verifyToken(token);
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (!user.is_active) {
      throw new UnauthorizedError('User account is inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
});

/**
 * Role-based authorization middleware
 * @param  {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `User role ${req.user.role} is not authorized to access this route`
      );
    }

    next();
  };
};

export default authMiddleware;
