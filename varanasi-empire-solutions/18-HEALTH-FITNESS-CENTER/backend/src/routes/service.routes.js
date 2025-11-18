import express from 'express';
import * as serviceController from '../controllers/service.controller.js';
const router = express.Router();
router.post('/', serviceController.create);
router.get('/', serviceController.getAll);
router.get('/:id', serviceController.getOne);
router.put('/:id', serviceController.update);
router.delete('/:id', serviceController.remove);
export default router;
