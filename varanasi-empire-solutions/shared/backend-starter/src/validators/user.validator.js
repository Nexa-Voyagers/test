import Joi from 'joi';

export const updateUserSchema = Joi.object({
  full_name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
    }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number',
    }),
});
