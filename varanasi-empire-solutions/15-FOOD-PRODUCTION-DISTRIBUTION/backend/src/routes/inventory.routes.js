import express from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';

const router = express.Router();

router.get('/', inventoryController.getAllInventory);
router.get('/low-stock', inventoryController.getLowStockItems);
router.get('/value', inventoryController.getInventoryValue);
router.get('/:id', inventoryController.getInventory);
router.post('/:id/add', inventoryController.addStock);
router.post('/:id/remove', inventoryController.removeStock);
router.post('/:id/reserve', inventoryController.reserveStock);
router.post('/:id/transfer', inventoryController.transferStock);

export default router;
