import express from 'express';
import * as firmController from '../controllers/firm.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Firms
 *   description: Service firm management endpoints
 */

// Public routes (if any)

// Protected routes - require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/v1/firms
 * @desc    Create a new service firm
 * @access  Private
 */
router.post('/', firmController.createFirm);

/**
 * @route   GET /api/v1/firms
 * @desc    Get all firms with pagination
 * @access  Private
 */
router.get('/', firmController.getAllFirms);

/**
 * @route   GET /api/v1/firms/type/:firmType
 * @desc    Get firms by type
 * @access  Private
 */
router.get('/type/:firmType', firmController.getFirmsByType);

/**
 * @route   GET /api/v1/firms/:id
 * @desc    Get firm by ID
 * @access  Private
 */
router.get('/:id', firmController.getFirmById);

/**
 * @route   GET /api/v1/firms/:id/statistics
 * @desc    Get firm statistics
 * @access  Private
 */
router.get('/:id/statistics', firmController.getFirmStatistics);

/**
 * @route   PUT /api/v1/firms/:id
 * @desc    Update firm
 * @access  Private
 */
router.put('/:id', firmController.updateFirm);

/**
 * @route   DELETE /api/v1/firms/:id
 * @desc    Delete firm (soft delete)
 * @access  Private
 */
router.delete('/:id', firmController.deleteFirm);

export default router;
