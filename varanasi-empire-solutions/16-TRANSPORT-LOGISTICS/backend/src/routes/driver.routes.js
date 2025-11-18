import express from 'express';
import * as driverController from '../controllers/driver.controller.js';
const router = express.Router();
router.post('/', driverController.create);
router.get('/', driverController.getAll);
router.get('/:id', driverController.getOne);
router.put('/:id', driverController.update);
router.delete('/:id', driverController.remove);
export default router;
