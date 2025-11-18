import express from 'express';
import trainerController from '../controllers/trainer.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', trainerController.createTrainer);
router.get('/', trainerController.getAllTrainers);
router.get('/check-availability', trainerController.checkAvailability);
router.get('/:id', trainerController.getTrainerById);
router.get('/:id/stats', trainerController.getTrainerWithStats);
router.get('/:id/schedule', trainerController.getTrainerSchedule);
router.put('/:id', trainerController.updateTrainer);
router.delete('/:id', trainerController.deleteTrainer);

export default router;
