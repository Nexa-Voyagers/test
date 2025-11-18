import express from 'express';
import productController from '../controllers/product.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product
 * @access  Private
 */
router.post('/', asyncHandler(productController.createProduct.bind(productController)));

/**
 * @route   POST /api/v1/products/bulk-update-stock
 * @desc    Bulk update stock
 * @access  Private
 */
router.post('/bulk-update-stock', asyncHandler(productController.bulkUpdateStock.bind(productController)));

/**
 * @route   GET /api/v1/products/search
 * @desc    Search products
 * @access  Private
 */
router.get('/search', asyncHandler(productController.searchProducts.bind(productController)));

/**
 * @route   GET /api/v1/products/low-stock
 * @desc    Get low stock products
 * @access  Private
 */
router.get('/low-stock', asyncHandler(productController.getLowStockProducts.bind(productController)));

/**
 * @route   GET /api/v1/products/out-of-stock
 * @desc    Get out of stock products
 * @access  Private
 */
router.get('/out-of-stock', asyncHandler(productController.getOutOfStockProducts.bind(productController)));

/**
 * @route   GET /api/v1/products/gi-tagged
 * @desc    Get GI tagged products
 * @access  Private
 */
router.get('/gi-tagged', asyncHandler(productController.getGITaggedProducts.bind(productController)));

/**
 * @route   GET /api/v1/products/:id/price
 * @desc    Get product price for customer type
 * @access  Private
 */
router.get('/:id/price', asyncHandler(productController.getProductPrice.bind(productController)));

/**
 * @route   PATCH /api/v1/products/:id/stock
 * @desc    Update product stock
 * @access  Private
 */
router.patch('/:id/stock', asyncHandler(productController.updateStock.bind(productController)));

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get product by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(productController.getProductById.bind(productController)));

/**
 * @route   GET /api/v1/products
 * @desc    Get all products with filters
 * @access  Private
 */
router.get('/', asyncHandler(productController.getAllProducts.bind(productController)));

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product
 * @access  Private
 */
router.put('/:id', asyncHandler(productController.updateProduct.bind(productController)));

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product
 * @access  Private
 */
router.delete('/:id', asyncHandler(productController.deleteProduct.bind(productController)));

export default router;
