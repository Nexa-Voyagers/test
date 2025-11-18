import express from 'express';
import * as classController from '../controllers/class.controller.js';

const router = express.Router();

router.get('/', classController.getAllClasss || classController.getAllClass || classController.getTimetable || classController.getAdmissionReport);
router.get('/:id', classController.getClassById || classController.getClass);
router.post('/', classController.createClass);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);

export default router;
