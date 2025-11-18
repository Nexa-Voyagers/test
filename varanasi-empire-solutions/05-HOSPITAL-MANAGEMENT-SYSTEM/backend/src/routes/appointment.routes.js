import express from 'express';
import {
  bookAppointment,
  getAppointment,
  getDoctorAppointments,
  getTodayAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots,
  getAppointmentStats,
} from '../controllers/appointment.controller.js';

const router = express.Router();

router.post('/', bookAppointment);
router.get('/stats', getAppointmentStats);
router.get('/doctor/:doctorId', getDoctorAppointments);
router.get('/doctor/:doctorId/today', getTodayAppointments);
router.get('/doctor/:doctorId/slots', getAvailableSlots);
router.get('/:id', getAppointment);
router.patch('/:id/status', updateAppointmentStatus);
router.post('/:id/cancel', cancelAppointment);

export default router;
