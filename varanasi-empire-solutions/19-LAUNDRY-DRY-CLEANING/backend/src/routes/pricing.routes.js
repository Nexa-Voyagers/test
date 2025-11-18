import express from 'express';
import * as pricingController from '../controllers/pricing.controller.js';
const router = express.Router();
router.post('/', pricingController.create);
router.get('/', pricingController.getAll);
router.get('/:id', pricingController.getOne);
router.put('/:id', pricingController.update);
router.delete('/:id', pricingController.remove);
export default router;
