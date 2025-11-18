import express from 'express';
import * as providerController from '../controllers/provider.controller.js';
const router = express.Router();
router.post('/', providerController.create);
router.get('/', providerController.getAll);
router.get('/:id', providerController.getOne);
router.put('/:id', providerController.update);
router.delete('/:id', providerController.remove);
export default router;
