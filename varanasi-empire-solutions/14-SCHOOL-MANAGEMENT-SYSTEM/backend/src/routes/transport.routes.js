import express from 'express';
import * as transportController from '../controllers/transport.controller.js';

const router = express.Router();

router.get('/', transportController.getAllTransports || transportController.getAllTransport || transportController.getTimetable || transportController.getAdmissionReport);
router.get('/:id', transportController.getTransportById || transportController.getTransport);
router.post('/', transportController.createTransport);
router.put('/:id', transportController.updateTransport);
router.delete('/:id', transportController.deleteTransport);

export default router;
