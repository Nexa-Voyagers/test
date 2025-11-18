import { AppError } from '../utils/errors.js';

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} source - Source of data to validate ('body', 'query', 'params')
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      const validationError = new AppError('Validation failed', 400);
      validationError.errors = errors;

      return next(validationError);
    }

    // Replace request data with validated value
    req[source] = value;
    next();
  };
};
