import express from 'express';
import * as studentController from '../controllers/student.controller.js';
const router = express.Router();
router.post('/', studentController.create);
router.get('/', studentController.getAll);
router.get('/:id', studentController.getOne);
router.put('/:id', studentController.update);
router.delete('/:id', studentController.remove);
export default router;
