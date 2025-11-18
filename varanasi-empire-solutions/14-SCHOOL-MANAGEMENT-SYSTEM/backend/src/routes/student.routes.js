import express from 'express';
import * as studentController from '../controllers/student.controller.js';

const router = express.Router();

router.get('/', studentController.getAllStudents || studentController.getAllStudent || studentController.getTimetable || studentController.getAdmissionReport);
router.get('/:id', studentController.getStudentById || studentController.getStudent);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

export default router;
