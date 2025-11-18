import express from 'express';
import * as bookingController from '../controllers/booking.controller.js';
const router = express.Router();
router.post('/', bookingController.create);
router.get('/', bookingController.getAll);
router.get('/:id', bookingController.getOne);
router.put('/:id', bookingController.update);
router.delete('/:id', bookingController.remove);
export default router;
