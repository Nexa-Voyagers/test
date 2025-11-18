import express from 'express';
import { orderController } from '../controllers/order.controller.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, preparing, ready, served, completed, cancelled]
 *       - in: query
 *         name: table_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 */
router.get('/', orderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', orderController.getOrderById);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               table_id:
 *                 type: string
 *               order_type:
 *                 type: string
 *                 enum: [dine_in, takeaway, delivery, online]
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menu_item_id:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     special_instructions:
 *                       type: string
 */
router.post('/', orderController.createOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/status', orderController.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}/items:
 *   post:
 *     summary: Add items to order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/items', orderController.addItemsToOrder);

/**
 * @swagger
 * /orders/{id}/items/{itemId}:
 *   delete:
 *     summary: Remove item from order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id/items/:itemId', orderController.removeItemFromOrder);

/**
 * @swagger
 * /orders/{id}/payment:
 *   post:
 *     summary: Process payment for order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/payment', orderController.processPayment);

/**
 * @swagger
 * /orders/{id}/kot:
 *   post:
 *     summary: Generate KOT (Kitchen Order Ticket)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/kot', orderController.generateKOT);

/**
 * @swagger
 * /orders/{id}/invoice:
 *   get:
 *     summary: Get order invoice
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/invoice', orderController.getInvoice);

export default router;
