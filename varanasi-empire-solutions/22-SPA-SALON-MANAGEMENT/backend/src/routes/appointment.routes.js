import express from 'express';
import * as appointmentController from '../controllers/appointment.controller.js';
const router = express.Router();
router.post('/', appointmentController.create);
router.get('/', appointmentController.getAll);
router.get('/:id', appointmentController.getOne);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.remove);
export default router;
