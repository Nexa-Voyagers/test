import express from 'express';
import * as teacherController from '../controllers/teacher.controller.js';

const router = express.Router();

router.get('/', teacherController.getAllTeachers || teacherController.getAllTeacher || teacherController.getTimetable || teacherController.getAdmissionReport);
router.get('/:id', teacherController.getTeacherById || teacherController.getTeacher);
router.post('/', teacherController.createTeacher);
router.put('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

export default router;
