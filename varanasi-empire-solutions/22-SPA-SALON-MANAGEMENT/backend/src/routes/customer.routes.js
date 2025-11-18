import express from 'express';
import * as customerController from '../controllers/customer.controller.js';
const router = express.Router();
router.post('/', customerController.create);
router.get('/', customerController.getAll);
router.get('/:id', customerController.getOne);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.remove);
export default router;
