import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authRateLimiter } from '../config/rateLimiter.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new staff member
 *     tags: [Authentication]
 */
router.post('/register', authRateLimiter, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login staff member
 *     tags: [Authentication]
 */
router.post('/login', authRateLimiter, authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.post('/change-password', authMiddleware, authController.changePassword);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.post('/logout', authMiddleware, authController.logout);

export default router;
