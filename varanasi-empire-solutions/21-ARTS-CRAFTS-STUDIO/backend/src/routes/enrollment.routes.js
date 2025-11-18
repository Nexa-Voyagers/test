import express from 'express';
import * as enrollmentController from '../controllers/enrollment.controller.js';
const router = express.Router();
router.post('/', enrollmentController.create);
router.get('/', enrollmentController.getAll);
router.get('/:id', enrollmentController.getOne);
router.put('/:id', enrollmentController.update);
router.delete('/:id', enrollmentController.remove);
export default router;
