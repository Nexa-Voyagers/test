import express from 'express';
import taskController from '../controllers/task.controller.js';
import guestController from '../controllers/guest.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Task routes
router.post('/', taskController.createTask);
router.post('/bulk', taskController.createBulkTasks);
router.post('/wedding-checklist', taskController.generateWeddingChecklist);
router.get('/', taskController.getTasks);
router.get('/overdue', taskController.getOverdueTasks);
router.get('/due-soon', taskController.getTasksDueSoon);
router.get('/assignee/:assignedTo', taskController.getTasksByAssignee);
router.get('/event/:eventId', taskController.getEventTasks);
router.get('/event/:eventId/statistics', taskController.getEventTaskStatistics);
router.get('/event/:eventId/by-category', taskController.getTasksByCategory);
router.get('/event/:eventId/by-priority', taskController.getTasksByPriority);
router.get('/:id', taskController.getTaskById);
router.put('/:id/status', taskController.updateTaskStatus);
router.put('/:id/complete', taskController.completeTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Guest routes (combined with tasks as they're closely related)
router.post('/guests', guestController.createGuest);
router.post('/guests/bulk', guestController.createBulkGuests);
router.post('/guests/import', guestController.importGuestsFromCSV);
router.get('/guests', guestController.getGuests);
router.get('/guests/event/:eventId', guestController.getEventGuests);
router.get('/guests/event/:eventId/statistics', guestController.getEventGuestStatistics);
router.get('/guests/event/:eventId/by-category', guestController.getStatisticsByCategory);
router.get('/guests/event/:eventId/rsvp/:rsvpStatus', guestController.getGuestsByRSVPStatus);
router.get('/guests/event/:eventId/category/:category', guestController.getGuestsByCategory);
router.get('/guests/event/:eventId/no-invitation', guestController.getGuestsWithoutInvitations);
router.get('/guests/event/:eventId/pending-rsvp', guestController.getGuestsWithPendingRSVP);
router.get('/guests/event/:eventId/special-requirements', guestController.getGuestsWithSpecialRequirements);
router.get('/guests/event/:eventId/confirmed-count', guestController.getConfirmedAttendeesCount);
router.get('/guests/event/:eventId/search', guestController.searchGuests);
router.get('/guests/:id', guestController.getGuestById);
router.put('/guests/:id/rsvp', guestController.updateRSVPStatus);
router.put('/guests/:id/invitation-sent', guestController.markInvitationSent);
router.put('/guests/invitations/bulk-sent', guestController.markMultipleInvitationsSent);
router.put('/guests/:id', guestController.updateGuest);
router.delete('/guests/:id', guestController.deleteGuest);

export default router;
