import express from 'express';
import { menuController } from '../controllers/menu.controller.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /menu/categories:
 *   get:
 *     summary: Get all menu categories
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 */
router.get('/categories', menuController.getCategories);

/**
 * @swagger
 * /menu/categories:
 *   post:
 *     summary: Create menu category (Admin/Manager only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 */
router.post('/categories', authorize('admin', 'manager'), menuController.createCategory);

/**
 * @swagger
 * /menu/items:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 */
router.get('/items', menuController.getRestaurantItems);

/**
 * @swagger
 * /menu/items/{id}:
 *   get:
 *     summary: Get menu item by ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 */
router.get('/items/:id', menuController.getMenuItem);

/**
 * @swagger
 * /menu/items:
 *   post:
 *     summary: Create menu item (Admin/Manager only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 */
router.post('/items', authorize('admin', 'manager'), menuController.createItem);

/**
 * @swagger
 * /menu/items/{id}:
 *   put:
 *     summary: Update menu item (Admin/Manager only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 */
router.put('/items/:id', authorize('admin', 'manager'), menuController.updateItem);

/**
 * @swagger
 * /menu/items/{id}:
 *   delete:
 *     summary: Delete menu item (Admin only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/items/:id', authorize('admin'), menuController.deleteItem);

/**
 * @swagger
 * /menu/items/{id}/availability:
 *   patch:
 *     summary: Update menu item availability
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 */

export default router;
