import express from 'express';
import * as warehouseController from '../controllers/warehouse.controller.js';
const router = express.Router();
router.post('/', warehouseController.create);
router.get('/', warehouseController.getAll);
router.get('/:id', warehouseController.getOne);
router.put('/:id', warehouseController.update);
router.delete('/:id', warehouseController.remove);
export default router;
