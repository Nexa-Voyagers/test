import express from 'express';
import weaverController from '../controllers/weaver.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/weavers
 * @desc    Create a new weaver
 * @access  Private
 */
router.post('/', asyncHandler(weaverController.createWeaver.bind(weaverController)));

/**
 * @route   GET /api/v1/weavers/search
 * @desc    Search weavers
 * @access  Private
 */
router.get('/search', asyncHandler(weaverController.searchWeavers.bind(weaverController)));

/**
 * @route   GET /api/v1/weavers/top-rated
 * @desc    Get top rated weavers
 * @access  Private
 */
router.get('/top-rated', asyncHandler(weaverController.getTopRated.bind(weaverController)));

/**
 * @route   GET /api/v1/weavers/:id/orders
 * @desc    Get weaver order history
 * @access  Private
 */
router.get('/:id/orders', asyncHandler(weaverController.getOrderHistory.bind(weaverController)));

/**
 * @route   GET /api/v1/weavers/:id/performance
 * @desc    Get weaver performance statistics
 * @access  Private
 */
router.get('/:id/performance', asyncHandler(weaverController.getPerformance.bind(weaverController)));

/**
 * @route   PATCH /api/v1/weavers/:id/rating
 * @desc    Update weaver quality rating
 * @access  Private
 */
router.patch('/:id/rating', asyncHandler(weaverController.updateQualityRating.bind(weaverController)));

/**
 * @route   GET /api/v1/weavers/:id
 * @desc    Get weaver by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(weaverController.getWeaverById.bind(weaverController)));

/**
 * @route   GET /api/v1/weavers
 * @desc    Get all weavers with filters
 * @access  Private
 */
router.get('/', asyncHandler(weaverController.getAllWeavers.bind(weaverController)));

/**
 * @route   PUT /api/v1/weavers/:id
 * @desc    Update weaver
 * @access  Private
 */
router.put('/:id', asyncHandler(weaverController.updateWeaver.bind(weaverController)));

/**
 * @route   DELETE /api/v1/weavers/:id
 * @desc    Delete weaver
 * @access  Private
 */
router.delete('/:id', asyncHandler(weaverController.deleteWeaver.bind(weaverController)));

export default router;
