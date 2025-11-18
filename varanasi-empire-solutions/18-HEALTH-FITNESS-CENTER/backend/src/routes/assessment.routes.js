import express from 'express';
import * as assessmentController from '../controllers/assessment.controller.js';
const router = express.Router();
router.post('/', assessmentController.create);
router.get('/', assessmentController.getAll);
router.get('/:id', assessmentController.getOne);
router.put('/:id', assessmentController.update);
router.delete('/:id', assessmentController.remove);
export default router;
