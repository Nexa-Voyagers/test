import express from 'express';
import * as clientController from '../controllers/client.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management endpoints
 */

// Protected routes - require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/v1/clients
 * @desc    Create a new client
 * @access  Private
 */
router.post('/', clientController.createClient);

/**
 * @route   GET /api/v1/clients
 * @desc    Get all clients with pagination
 * @access  Private
 */
router.get('/', clientController.getAllClients);

/**
 * @route   GET /api/v1/clients/search
 * @desc    Search clients by name, company, or phone
 * @access  Private
 */
router.get('/search', clientController.searchClients);

/**
 * @route   GET /api/v1/clients/outstanding-payments
 * @desc    Get clients with outstanding payments
 * @access  Private
 */
router.get('/outstanding-payments', clientController.getClientsWithOutstandingPayments);

/**
 * @route   GET /api/v1/clients/:id
 * @desc    Get client by ID
 * @access  Private
 */
router.get('/:id', clientController.getClientById);

/**
 * @route   GET /api/v1/clients/:id/statistics
 * @desc    Get client statistics
 * @access  Private
 */
router.get('/:id/statistics', clientController.getClientStatistics);

/**
 * @route   PUT /api/v1/clients/:id
 * @desc    Update client
 * @access  Private
 */
router.put('/:id', clientController.updateClient);

/**
 * @route   DELETE /api/v1/clients/:id
 * @desc    Delete client (soft delete)
 * @access  Private
 */
router.delete('/:id', clientController.deleteClient);

export default router;
