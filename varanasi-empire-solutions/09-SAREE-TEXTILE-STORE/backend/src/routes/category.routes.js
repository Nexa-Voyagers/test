import express from 'express';
import categoryController from '../controllers/category.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Private
 */
router.post('/', asyncHandler(categoryController.createCategory.bind(categoryController)));

/**
 * @route   GET /api/v1/categories/search
 * @desc    Search categories
 * @access  Private
 */
router.get('/search', asyncHandler(categoryController.searchCategories.bind(categoryController)));

/**
 * @route   GET /api/v1/categories/hierarchy
 * @desc    Get category hierarchy
 * @access  Private
 */
router.get('/hierarchy', asyncHandler(categoryController.getCategoryHierarchy.bind(categoryController)));

/**
 * @route   GET /api/v1/categories/root
 * @desc    Get root categories
 * @access  Private
 */
router.get('/root', asyncHandler(categoryController.getRootCategories.bind(categoryController)));

/**
 * @route   GET /api/v1/categories/:id/subcategories
 * @desc    Get subcategories
 * @access  Private
 */
router.get('/:id/subcategories', asyncHandler(categoryController.getSubcategories.bind(categoryController)));

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get category by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(categoryController.getCategoryById.bind(categoryController)));

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Private
 */
router.get('/', asyncHandler(categoryController.getAllCategories.bind(categoryController)));

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update category
 * @access  Private
 */
router.put('/:id', asyncHandler(categoryController.updateCategory.bind(categoryController)));

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete category
 * @access  Private
 */
router.delete('/:id', asyncHandler(categoryController.deleteCategory.bind(categoryController)));

export default router;
