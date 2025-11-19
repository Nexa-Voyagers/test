import express from 'express';
import { restaurantController } from '../controllers/restaurant.controller.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants (Admin/Manager only)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authorize('admin', 'manager'), restaurantController.getAllRestaurants);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', restaurantController.getRestaurant);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create new restaurant (Admin only)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authorize('admin'), restaurantController.createRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Update restaurant (Admin/Manager only)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authorize('admin', 'manager'), restaurantController.updateRestaurant);

/**
 * @swagger
 * /restaurants/{id}/settings:
 *   put:
 *     summary: Update restaurant settings
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/settings', authorize('admin', 'manager'), restaurantController.updateSettings);

export default router;
