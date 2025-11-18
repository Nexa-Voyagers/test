import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
const router = express.Router();
router.post('/', reviewController.create);
router.get('/', reviewController.getAll);
router.get('/:id', reviewController.getOne);
router.put('/:id', reviewController.update);
router.delete('/:id', reviewController.remove);
export default router;
