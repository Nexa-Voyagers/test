import express from 'express';
import gymController from '../controllers/gym.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Gym routes
router.post('/', gymController.createGym);
router.get('/', gymController.getAllGyms);
router.get('/active', gymController.getActiveGyms);
router.get('/search', gymController.searchGyms);
router.get('/:id', gymController.getGymById);
router.get('/:id/stats', gymController.getGymWithStats);
router.put('/:id', gymController.updateGym);
router.delete('/:id', gymController.deleteGym);

export default router;
