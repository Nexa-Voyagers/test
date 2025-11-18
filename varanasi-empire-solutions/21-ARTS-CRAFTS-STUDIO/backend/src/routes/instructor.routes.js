import express from 'express';
import * as instructorController from '../controllers/instructor.controller.js';
const router = express.Router();
router.post('/', instructorController.create);
router.get('/', instructorController.getAll);
router.get('/:id', instructorController.getOne);
router.put('/:id', instructorController.update);
router.delete('/:id', instructorController.remove);
export default router;
