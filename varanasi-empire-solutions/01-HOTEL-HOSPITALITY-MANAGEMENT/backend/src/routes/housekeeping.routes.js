import express from 'express';
import { housekeepingController } from '../controllers/housekeeping.controller.js';

const router = express.Router();

// Tasks
router.post('/tasks', housekeepingController.createTask);
router.post('/tasks/:id/assign', housekeepingController.assignTask);

// Room cleaning workflow
router.post('/rooms/:id/cleaning/start', housekeepingController.startCleaning);
router.post('/rooms/:id/cleaning/complete', housekeepingController.completeCleaning);
router.post('/rooms/:id/inspect', housekeepingController.inspectRoom);
router.post('/rooms/:id/mark-clean', housekeepingController.markRoomClean);

// Property housekeeping
router.get('/property/:propertyId/dirty-rooms', housekeepingController.getRoomsNeedingCleaning);
router.get('/property/:propertyId/inspection-rooms', housekeepingController.getRoomsForInspection);
router.get('/property/:propertyId/cleaned-rooms', housekeepingController.getCleanedRooms);
router.get('/property/:propertyId/tasks', housekeepingController.getTasksByProperty);
router.get('/property/:propertyId/stats', housekeepingController.getStats);

export default router;
