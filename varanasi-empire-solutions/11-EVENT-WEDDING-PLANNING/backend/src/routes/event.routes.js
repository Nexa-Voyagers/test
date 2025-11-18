import express from 'express';
import eventController from '../controllers/event.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Event routes
router.post('/', eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/budget-alerts', eventController.getBudgetAlerts);
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/statistics/status', eventController.getStatusStatistics);
router.get('/:id/details', eventController.getEventDetails);
router.get('/:id/budget', eventController.getEventBudget);
router.get('/:id/readiness', eventController.checkEventReadiness);
router.get('/:id', eventController.getEventById);
router.put('/:id/status', eventController.updateEventStatus);
router.put('/:id/recalculate-cost', eventController.recalculateEventCost);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;
