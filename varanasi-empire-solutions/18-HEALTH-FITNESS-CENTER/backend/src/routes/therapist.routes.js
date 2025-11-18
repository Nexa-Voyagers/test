import express from 'express';
import * as therapistController from '../controllers/therapist.controller.js';
const router = express.Router();
router.post('/', therapistController.create);
router.get('/', therapistController.getAll);
router.get('/:id', therapistController.getOne);
router.put('/:id', therapistController.update);
router.delete('/:id', therapistController.remove);
export default router;
