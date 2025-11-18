import express from 'express';
import * as distributorController from '../controllers/distributor.controller.js';

const router = express.Router();

router.post('/', distributorController.createDistributor);
router.get('/', distributorController.getAllDistributors);
router.get('/:id', distributorController.getDistributor);
router.put('/:id', distributorController.updateDistributor);
router.delete('/:id', distributorController.deleteDistributor);
router.get('/:id/stats', distributorController.getDistributorStats);

export default router;
