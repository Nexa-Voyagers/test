import express from 'express';
import { inventoryController } from '../controllers/inventory.controller.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /inventory/ingredients:
 *   get:
 *     summary: Get all ingredients
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.get('/ingredients', inventoryController.getAllIngredients);

/**
 * @swagger
 * /inventory/ingredients:
 *   post:
 *     summary: Add new ingredient (Admin/Manager only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.post('/ingredients', authorize('admin', 'manager'), inventoryController.addIngredient);

/**
 * @swagger
 * /inventory/stock:
 *   get:
 *     summary: Get current stock levels
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stock', inventoryController.getStockLevels);

/**
 * @swagger
 * /inventory/stock/update:
 *   post:
 *     summary: Update stock (Admin/Manager only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.post('/stock/update', authorize('admin', 'manager'), inventoryController.updateStock);

/**
 * @swagger
 * /inventory/alerts:
 *   get:
 *     summary: Get low stock alerts
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.get('/alerts', authorize('admin', 'manager'), inventoryController.getLowStockAlerts);

/**
 * @swagger
 * /inventory/purchase-orders:
 *   get:
 *     summary: Get all purchase orders
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.get('/purchase-orders', authorize('admin', 'manager'), inventoryController.getPurchaseOrders);

/**
 * @swagger
 * /inventory/purchase-orders:
 *   post:
 *     summary: Create purchase order (Admin/Manager only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.post('/purchase-orders', authorize('admin', 'manager'), inventoryController.createPurchaseOrder);

export default router;
