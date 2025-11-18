import express from 'express';
import { tableController } from '../controllers/table.controller.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Get all tables
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', tableController.getAllTables);

/**
 * @swagger
 * /tables/{id}:
 *   get:
 *     summary: Get table by ID
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', tableController.getTableById);

/**
 * @swagger
 * /tables:
 *   post:
 *     summary: Create table (Admin/Manager only)
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authorize('admin', 'manager'), tableController.createTable);

/**
 * @swagger
 * /tables/{id}:
 *   put:
 *     summary: Update table (Admin/Manager only)
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authorize('admin', 'manager'), tableController.updateTable);

/**
 * @swagger
 * /tables/{id}/status:
 *   patch:
 *     summary: Update table status
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/status', tableController.updateTableStatus);

/**
 * @swagger
 * /tables/{id}/qr:
 *   get:
 *     summary: Generate QR code for table
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/qr', tableController.generateQRCode);

export default router;
