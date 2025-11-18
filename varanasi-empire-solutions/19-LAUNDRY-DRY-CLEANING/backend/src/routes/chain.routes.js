import express from 'express';
import * as chainController from '../controllers/chain.controller.js';
const router = express.Router();
router.post('/', chainController.create);
router.get('/', chainController.getAll);
router.get('/:id', chainController.getOne);
router.put('/:id', chainController.update);
router.delete('/:id', chainController.remove);
export default router;
