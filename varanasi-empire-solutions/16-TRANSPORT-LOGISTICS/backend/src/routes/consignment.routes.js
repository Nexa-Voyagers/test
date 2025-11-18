import express from 'express';
import * as consignmentController from '../controllers/consignment.controller.js';
const router = express.Router();
router.post('/', consignmentController.create);
router.get('/', consignmentController.getAll);
router.get('/:id', consignmentController.getOne);
router.put('/:id', consignmentController.update);
router.delete('/:id', consignmentController.remove);
export default router;
