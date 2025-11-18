import { AppError } from '../utils/errors.js';

/**
 * 404 Not Found handler middleware
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.method} ${req.path} not found`, 404);
  next(error);
};
