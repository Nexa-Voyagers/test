import express from 'express';
import * as professionalController from '../controllers/professional.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description: Professional management endpoints
 */

// Protected routes - require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/v1/professionals
 * @desc    Create a new professional
 * @access  Private
 */
router.post('/', professionalController.createProfessional);

/**
 * @route   GET /api/v1/professionals
 * @desc    Get all professionals with pagination
 * @access  Private
 */
router.get('/', professionalController.getAllProfessionals);

/**
 * @route   GET /api/v1/professionals/firm/:firmId/available
 * @desc    Get available professionals for case assignment
 * @access  Private
 */
router.get('/firm/:firmId/available', professionalController.getAvailableProfessionals);

/**
 * @route   GET /api/v1/professionals/:id
 * @desc    Get professional by ID
 * @access  Private
 */
router.get('/:id', professionalController.getProfessionalById);

/**
 * @route   GET /api/v1/professionals/:id/workload
 * @desc    Get professional workload
 * @access  Private
 */
router.get('/:id/workload', professionalController.getProfessionalWorkload);

/**
 * @route   GET /api/v1/professionals/:id/performance
 * @desc    Get professional performance metrics
 * @access  Private
 */
router.get('/:id/performance', professionalController.getProfessionalPerformance);

/**
 * @route   PUT /api/v1/professionals/:id
 * @desc    Update professional
 * @access  Private
 */
router.put('/:id', professionalController.updateProfessional);

/**
 * @route   DELETE /api/v1/professionals/:id
 * @desc    Delete professional (soft delete)
 * @access  Private
 */
router.delete('/:id', professionalController.deleteProfessional);

export default router;
