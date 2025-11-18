import { ValidationError } from '../utils/errors.js';

/**
 * Validation middleware using Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Middleware function
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(
      { ...req.body, ...req.params, ...req.query },
      { abortEarly: false }
    );

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return next(new ValidationError(errors));
    }

    // Update request with validated data
    req.validated = value;
    next();
  };
};

/**
 * Validate request body
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Middleware function
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return next(new ValidationError(errors));
    }

    req.body = value;
    next();
  };
};

/**
 * Validate request params
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Middleware function
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return next(new ValidationError(errors));
    }

    req.params = value;
    next();
  };
};

/**
 * Validate request query
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Middleware function
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return next(new ValidationError(errors));
    }

    req.query = value;
    next();
  };
};
