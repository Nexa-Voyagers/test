import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

/**
 * Validate request using express-validator
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    throw new ValidationError(formattedErrors);
  }

  next();
};

export default validate;
