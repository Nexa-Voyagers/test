import express from 'express';
import sessionController from '../controllers/session.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', sessionController.createSession);
router.get('/', sessionController.getAllSessions);
router.get('/statistics', sessionController.getSessionStatistics);
router.get('/member/:memberId/upcoming', sessionController.getUpcomingSessionsByMember);
router.get('/trainer/:trainerId/upcoming', sessionController.getUpcomingSessionsByTrainer);
router.get('/:id', sessionController.getSessionById);
router.put('/:id', sessionController.updateSession);
router.post('/:id/complete', sessionController.completeSession);
router.post('/:id/cancel', sessionController.cancelSession);
router.post('/:id/no-show', sessionController.markNoShow);

export default router;
