import express from 'express';
import * as unitController from '../controllers/unit.controller.js';

const router = express.Router();

router.post('/', unitController.createUnit);
router.get('/', unitController.getAllUnits);
router.get('/:id', unitController.getUnit);
router.put('/:id', unitController.updateUnit);
router.delete('/:id', unitController.deleteUnit);
router.get('/:id/stats', unitController.getUnitStats);
router.patch('/:id/activate', unitController.activateUnit);
router.patch('/:id/deactivate', unitController.deactivateUnit);

export default router;
