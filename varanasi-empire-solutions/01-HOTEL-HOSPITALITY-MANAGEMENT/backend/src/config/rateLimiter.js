import rateLimit from 'express-rate-limit';

/**
 * General rate limiter - 100 requests per 15 minutes
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth rate limiter - 5 attempts per 15 minutes
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

/**
 * Booking rate limiter - 20 requests per 15 minutes
 */
export const bookingRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many booking requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * API rate limiter - 50 requests per 15 minutes
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many API requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
