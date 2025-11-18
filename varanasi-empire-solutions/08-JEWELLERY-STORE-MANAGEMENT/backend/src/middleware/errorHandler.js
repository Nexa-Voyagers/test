import { logger } from '../config/logger.js';
import { AppError } from '../utils/errors.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Postgres duplicate key error
  if (err.code === '23505') {
    error = new AppError('Duplicate entry found', 409);
  }

  // Postgres foreign key violation
  if (err.code === '23503') {
    error = new AppError('Referenced resource not found', 400);
  }

  // Postgres not null violation
  if (err.code === '23502') {
    error = new AppError('Required field missing', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new AppError('Validation failed', 400, messages);
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || null,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
