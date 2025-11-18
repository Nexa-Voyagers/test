import express from 'express';
import * as caseController from '../controllers/case.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cases
 *   description: Case management endpoints
 */

// Protected routes - require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/v1/cases
 * @desc    Create a new case
 * @access  Private
 */
router.post('/', caseController.createCase);

/**
 * @route   GET /api/v1/cases
 * @desc    Get all cases with pagination
 * @access  Private
 */
router.get('/', caseController.getAllCases);

/**
 * @route   GET /api/v1/cases/upcoming-hearings
 * @desc    Get cases with upcoming hearings
 * @access  Private
 */
router.get('/upcoming-hearings', caseController.getUpcomingHearings);

/**
 * @route   GET /api/v1/cases/old-cases
 * @desc    Get old cases (older than threshold days)
 * @access  Private
 */
router.get('/old-cases', caseController.getOldCases);

/**
 * @route   GET /api/v1/cases/statistics
 * @desc    Get case statistics
 * @access  Private
 */
router.get('/statistics', caseController.getCaseStatistics);

/**
 * @route   GET /api/v1/cases/:id
 * @desc    Get case by ID
 * @access  Private
 */
router.get('/:id', caseController.getCaseById);

/**
 * @route   PUT /api/v1/cases/:id
 * @desc    Update case
 * @access  Private
 */
router.put('/:id', caseController.updateCase);

/**
 * @route   PATCH /api/v1/cases/:id/status
 * @desc    Update case status
 * @access  Private
 */
router.patch('/:id/status', caseController.updateCaseStatus);

/**
 * @route   DELETE /api/v1/cases/:id
 * @desc    Delete case
 * @access  Private
 */
router.delete('/:id', caseController.deleteCase);

export default router;
