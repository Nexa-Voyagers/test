import { logger } from '../config/logger.js';
import { AppError } from '../utils/errors.js';

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    statusCode: err.statusCode || 500,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  // Set default error properties
  let error = err;

  if (!(error instanceof AppError)) {
    // Handle specific error types
    if (error.name === 'ValidationError') {
      error = new AppError('Validation failed', 400, error.errors);
    } else if (error.name === 'JsonWebTokenError') {
      error = new AppError('Invalid token', 401);
    } else if (error.name === 'TokenExpiredError') {
      error = new AppError('Token expired', 401);
    } else if (error.code === 'ENOENT') {
      error = new AppError('File not found', 404);
    } else if (error.code === '23505') {
      // PostgreSQL unique constraint violation
      error = new AppError('Record with this value already exists', 409);
    } else if (error.code === '23503') {
      // PostgreSQL foreign key constraint violation
      error = new AppError('Referenced record not found', 404);
    } else {
      error = new AppError(error.message || 'Internal server error', error.statusCode || 500);
    }
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
