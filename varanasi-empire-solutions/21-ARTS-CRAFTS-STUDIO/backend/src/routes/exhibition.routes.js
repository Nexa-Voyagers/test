import express from 'express';
import * as exhibitionController from '../controllers/exhibition.controller.js';
const router = express.Router();
router.post('/', exhibitionController.create);
router.get('/', exhibitionController.getAll);
router.get('/:id', exhibitionController.getOne);
router.put('/:id', exhibitionController.update);
router.delete('/:id', exhibitionController.remove);
export default router;
