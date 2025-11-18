import express from 'express';
import dietController from '../controllers/diet.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', dietController.createDietPlan);
router.get('/', dietController.getAllDietPlans);
router.get('/statistics', dietController.getDietPlanStatistics);
router.get('/member/:memberId', dietController.getDietPlansByMember);
router.get('/member/:memberId/active', dietController.getActiveDietPlan);
router.get('/trainer/:trainerId', dietController.getDietPlansByTrainer);
router.get('/:id', dietController.getDietPlanById);
router.get('/:id/day/:day', dietController.getMealPlanByDay);
router.put('/:id', dietController.updateDietPlan);
router.post('/:id/deactivate', dietController.deactivateDietPlan);
router.delete('/:id', dietController.deleteDietPlan);

export default router;
