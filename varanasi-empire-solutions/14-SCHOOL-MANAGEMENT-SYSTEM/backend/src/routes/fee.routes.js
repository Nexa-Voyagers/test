import express from 'express';
import * as feeController from '../controllers/fee.controller.js';

const router = express.Router();

router.get('/', feeController.getAllFees || feeController.getAllFee || feeController.getTimetable || feeController.getAdmissionReport);
router.get('/:id', feeController.getFeeById || feeController.getFee);
router.post('/', feeController.createFee);
router.put('/:id', feeController.updateFee);
router.delete('/:id', feeController.deleteFee);

export default router;
