import express from 'express';
import storeController from '../controllers/store.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/stores
 * @desc    Create a new textile store
 * @access  Private
 */
router.post('/', asyncHandler(storeController.createStore.bind(storeController)));

/**
 * @route   GET /api/v1/stores/search
 * @desc    Search stores
 * @access  Private
 */
router.get('/search', asyncHandler(storeController.searchStores.bind(storeController)));

/**
 * @route   GET /api/v1/stores/:id/statistics
 * @desc    Get store statistics
 * @access  Private
 */
router.get('/:id/statistics', asyncHandler(storeController.getStoreStatistics.bind(storeController)));

/**
 * @route   GET /api/v1/stores/:id
 * @desc    Get store by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(storeController.getStoreById.bind(storeController)));

/**
 * @route   GET /api/v1/stores
 * @desc    Get all stores with filters
 * @access  Private
 */
router.get('/', asyncHandler(storeController.getAllStores.bind(storeController)));

/**
 * @route   PUT /api/v1/stores/:id
 * @desc    Update store
 * @access  Private
 */
router.put('/:id', asyncHandler(storeController.updateStore.bind(storeController)));

/**
 * @route   DELETE /api/v1/stores/:id
 * @desc    Delete store
 * @access  Private
 */
router.delete('/:id', asyncHandler(storeController.deleteStore.bind(storeController)));

export default router;
