import express from 'express';
import * as vehicleController from '../controllers/vehicle.controller.js';
const router = express.Router();
router.post('/', vehicleController.create);
router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getOne);
router.put('/:id', vehicleController.update);
router.delete('/:id', vehicleController.remove);
export default router;
