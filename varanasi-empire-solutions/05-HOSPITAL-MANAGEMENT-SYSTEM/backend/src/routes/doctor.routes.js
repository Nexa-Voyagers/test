import express from 'express';
import { getDoctors, getDoctor, createDoctor, updateDoctor } from '../controllers/doctor.controller.js';

const router = express.Router();

router.get('/', getDoctors);
router.post('/', createDoctor);
router.get('/:id', getDoctor);
router.put('/:id', updateDoctor);

export default router;
