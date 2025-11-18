import express from 'express';
import { roomController } from '../controllers/room.controller.js';

const router = express.Router();

router.post('/', roomController.createRoom);
router.get('/:id', roomController.getRoom);
router.put('/:id', roomController.updateRoom);
router.post('/availability/check', roomController.checkAvailability);
router.patch('/:id/mark-available', roomController.markAvailable);
router.patch('/:id/mark-maintenance', roomController.markMaintenance);
router.patch('/:id/block', roomController.blockRoom);

// Property rooms
router.get('/property/:propertyId/rooms', roomController.getRoomsByProperty);
router.get('/property/:propertyId/status', roomController.getRoomStatusSummary);

export default router;
