import express from 'express';
import * as examController from '../controllers/exam.controller.js';

const router = express.Router();

router.get('/', examController.getAllExams || examController.getAllExam || examController.getTimetable || examController.getAdmissionReport);
router.get('/:id', examController.getExamById || examController.getExam);
router.post('/', examController.createExam);
router.put('/:id', examController.updateExam);
router.delete('/:id', examController.deleteExam);

export default router;
