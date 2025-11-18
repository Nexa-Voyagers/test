import express from 'express';
import * as documentController from '../controllers/document.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document management endpoints
 */

// Protected routes - require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/v1/documents
 * @desc    Create a new document
 * @access  Private
 */
router.post('/', documentController.createDocument);

/**
 * @route   GET /api/v1/documents
 * @desc    Get all documents with pagination
 * @access  Private
 */
router.get('/', documentController.getAllDocuments);

/**
 * @route   GET /api/v1/documents/search
 * @desc    Search documents
 * @access  Private
 */
router.get('/search', documentController.searchDocuments);

/**
 * @route   GET /api/v1/documents/recent
 * @desc    Get recent documents
 * @access  Private
 */
router.get('/recent', documentController.getRecentDocuments);

/**
 * @route   GET /api/v1/documents/statistics
 * @desc    Get document statistics
 * @access  Private
 */
router.get('/statistics', documentController.getDocumentStatistics);

/**
 * @route   GET /api/v1/documents/types
 * @desc    Get valid document types
 * @access  Private
 */
router.get('/types', documentController.getValidDocumentTypes);

/**
 * @route   GET /api/v1/documents/case/:caseId
 * @desc    Get documents by case ID
 * @access  Private
 */
router.get('/case/:caseId', documentController.getDocumentsByCaseId);

/**
 * @route   GET /api/v1/documents/type/:documentType
 * @desc    Get documents by type
 * @access  Private
 */
router.get('/type/:documentType', documentController.getDocumentsByType);

/**
 * @route   GET /api/v1/documents/:id
 * @desc    Get document by ID
 * @access  Private
 */
router.get('/:id', documentController.getDocumentById);

/**
 * @route   PUT /api/v1/documents/:id
 * @desc    Update document
 * @access  Private
 */
router.put('/:id', documentController.updateDocument);

/**
 * @route   DELETE /api/v1/documents/:id
 * @desc    Delete document
 * @access  Private
 */
router.delete('/:id', documentController.deleteDocument);

export default router;
