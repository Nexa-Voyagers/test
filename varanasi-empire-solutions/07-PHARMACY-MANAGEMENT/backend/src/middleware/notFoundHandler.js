import { AppError } from '../utils/errors.js';

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
