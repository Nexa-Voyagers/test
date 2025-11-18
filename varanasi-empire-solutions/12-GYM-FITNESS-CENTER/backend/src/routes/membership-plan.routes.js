import express from 'express';
import membershipPlanController from '../controllers/membership-plan.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', membershipPlanController.createPlan);
router.get('/', membershipPlanController.getAllPlans);
router.get('/active', membershipPlanController.getActivePlans);
router.get('/with-stats', membershipPlanController.getPlansWithStats);
router.get('/:id', membershipPlanController.getPlanById);
router.get('/:id/stats', membershipPlanController.getPlanWithStats);
router.put('/:id', membershipPlanController.updatePlan);
router.delete('/:id', membershipPlanController.deletePlan);

export default router;
