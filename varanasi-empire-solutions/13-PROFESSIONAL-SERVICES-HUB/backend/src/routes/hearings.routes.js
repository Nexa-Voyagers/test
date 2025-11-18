import express from 'express';
import * as hearingController from '../controllers/hearing.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Hearings
 *   description: Case hearing management endpoints
 */

// Protected routes - require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/v1/hearings
 * @desc    Create a new hearing
 * @access  Private
 */
router.post('/', hearingController.createHearing);

/**
 * @route   GET /api/v1/hearings
 * @desc    Get all hearings with pagination
 * @access  Private
 */
router.get('/', hearingController.getAllHearings);

/**
 * @route   GET /api/v1/hearings/upcoming
 * @desc    Get upcoming hearings
 * @access  Private
 */
router.get('/upcoming', hearingController.getUpcomingHearings);

/**
 * @route   GET /api/v1/hearings/date-range
 * @desc    Get hearings by date range
 * @access  Private
 */
router.get('/date-range', hearingController.getHearingsByDateRange);

/**
 * @route   GET /api/v1/hearings/statistics
 * @desc    Get hearing statistics
 * @access  Private
 */
router.get('/statistics', hearingController.getHearingStatistics);

/**
 * @route   GET /api/v1/hearings/case/:caseId
 * @desc    Get hearings by case ID
 * @access  Private
 */
router.get('/case/:caseId', hearingController.getHearingsByCaseId);

/**
 * @route   GET /api/v1/hearings/:id
 * @desc    Get hearing by ID
 * @access  Private
 */
router.get('/:id', hearingController.getHearingById);

/**
 * @route   PUT /api/v1/hearings/:id
 * @desc    Update hearing
 * @access  Private
 */
router.put('/:id', hearingController.updateHearing);

/**
 * @route   PATCH /api/v1/hearings/:id/outcome
 * @desc    Record hearing outcome
 * @access  Private
 */
router.patch('/:id/outcome', hearingController.recordHearingOutcome);

/**
 * @route   DELETE /api/v1/hearings/:id
 * @desc    Delete hearing
 * @access  Private
 */
router.delete('/:id', hearingController.deleteHearing);

export default router;
