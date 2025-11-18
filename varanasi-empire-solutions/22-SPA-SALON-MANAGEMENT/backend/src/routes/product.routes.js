import express from 'express';
import * as productController from '../controllers/product.controller.js';
const router = express.Router();
router.post('/', productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);
export default router;
