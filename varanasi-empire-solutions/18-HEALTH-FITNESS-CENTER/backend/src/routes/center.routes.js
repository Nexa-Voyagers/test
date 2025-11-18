import express from 'express';
import * as centerController from '../controllers/center.controller.js';
const router = express.Router();
router.post('/', centerController.create);
router.get('/', centerController.getAll);
router.get('/:id', centerController.getOne);
router.put('/:id', centerController.update);
router.delete('/:id', centerController.remove);
export default router;
