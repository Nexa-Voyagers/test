import express from 'express';
import * as invoiceController from '../controllers/invoice.controller.js';
const router = express.Router();
router.post('/', invoiceController.create);
router.get('/', invoiceController.getAll);
router.get('/:id', invoiceController.getOne);
router.put('/:id', invoiceController.update);
router.delete('/:id', invoiceController.remove);
export default router;
