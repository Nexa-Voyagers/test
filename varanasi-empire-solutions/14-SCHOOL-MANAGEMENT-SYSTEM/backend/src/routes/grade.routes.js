import express from 'express';
import * as gradeController from '../controllers/grade.controller.js';

const router = express.Router();

router.get('/', gradeController.getAllGrades || gradeController.getAllGrade || gradeController.getTimetable || gradeController.getAdmissionReport);
router.get('/:id', gradeController.getGradeById || gradeController.getGrade);
router.post('/', gradeController.createGrade);
router.put('/:id', gradeController.updateGrade);
router.delete('/:id', gradeController.deleteGrade);

export default router;
