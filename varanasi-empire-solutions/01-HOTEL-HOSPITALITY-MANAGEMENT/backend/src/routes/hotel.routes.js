import express from 'express';
import { hotelController } from '../controllers/hotel.controller.js';

const router = express.Router();

router.post('/', hotelController.createProperty);
router.get('/', hotelController.getProperties);
router.get('/:id', hotelController.getProperty);
router.put('/:id', hotelController.updateProperty);
router.get('/:id/stats', hotelController.getPropertyStats);
router.get('/:id/settings', hotelController.getPropertySettings);
router.put('/:id/settings', hotelController.updatePropertySettings);

export default router;
