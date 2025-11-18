import express from 'express';
import * as subjectController from '../controllers/subject.controller.js';

const router = express.Router();

router.get('/', subjectController.getAllSubjects || subjectController.getAllSubject || subjectController.getTimetable || subjectController.getAdmissionReport);
router.get('/:id', subjectController.getSubjectById || subjectController.getSubject);
router.post('/', subjectController.createSubject);
router.put('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

export default router;
