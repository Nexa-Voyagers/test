import express from 'express';
import * as payoutController from '../controllers/payout.controller.js';
const router = express.Router();
router.post('/', payoutController.create);
router.get('/', payoutController.getAll);
router.get('/:id', payoutController.getOne);
router.put('/:id', payoutController.update);
router.delete('/:id', payoutController.remove);
export default router;
