import express from 'express';
import { userController } from '../controllers/user.controller.js';

const router = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 */
router.get('/profile', userController.getCurrentUser);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 */
router.put('/profile', userController.updateProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 */
router.get('/', userController.getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user
 *     security:
 *       - bearerAuth: []
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', userController.deleteUser);

export default router;
