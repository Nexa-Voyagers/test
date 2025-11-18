import express from 'express';
import workoutController from '../controllers/workout.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', workoutController.createWorkoutPlan);
router.get('/', workoutController.getAllWorkoutPlans);
router.get('/statistics', workoutController.getWorkoutPlanStatistics);
router.get('/member/:memberId', workoutController.getWorkoutPlansByMember);
router.get('/member/:memberId/active', workoutController.getActiveWorkoutPlan);
router.get('/trainer/:trainerId', workoutController.getWorkoutPlansByTrainer);
router.get('/:id', workoutController.getWorkoutPlanById);
router.get('/:id/day/:day', workoutController.getWorkoutScheduleByDay);
router.put('/:id', workoutController.updateWorkoutPlan);
router.post('/:id/deactivate', workoutController.deactivateWorkoutPlan);
router.delete('/:id', workoutController.deleteWorkoutPlan);

export default router;
