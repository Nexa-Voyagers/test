import express from 'express';
import clientController from '../controllers/client.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Client routes
router.post('/', clientController.createClient);
router.get('/', clientController.getClients);
router.get('/search', clientController.searchClients);
router.get('/:id/profile', clientController.getClientProfile);
router.get('/:id/events', clientController.getClientEvents);
router.get('/:id/statistics', clientController.getClientStatistics);
router.get('/:id', clientController.getClientById);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export default router;
