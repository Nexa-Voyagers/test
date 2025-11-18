import { appointmentService } from '../services/appointment.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Book appointment
 * POST /api/appointments
 */
export const bookAppointment = asyncHandler(async (req, res) => {
  const appointmentData = {
    ...req.body,
    hospital_id: req.user.hospital_id,
    created_by: req.user.id,
  };

  const appointment = await appointmentService.bookAppointment(appointmentData);

  logger.info(`Appointment booked: ${appointment.appointment_id}`);

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
    data: appointment,
  });
});

/**
 * Get appointment by ID
 * GET /api/appointments/:id
 */
export const getAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await appointmentService.getAppointment(id);

  res.json({
    success: true,
    data: appointment,
  });
});

/**
 * Get doctor appointments for a date
 * GET /api/appointments/doctor/:doctorId?date=YYYY-MM-DD
 */
export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  const appointments = await appointmentService.getDoctorAppointments(doctorId, date);

  res.json({
    success: true,
    data: appointments,
    count: appointments.length,
  });
});

/**
 * Get today's appointments for doctor
 * GET /api/appointments/doctor/:doctorId/today
 */
export const getTodayAppointments = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const appointments = await appointmentService.getTodayAppointments(doctorId);

  res.json({
    success: true,
    data: appointments,
    count: appointments.length,
  });
});

/**
 * Update appointment status
 * PATCH /api/appointments/:id/status
 */
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const appointment = await appointmentService.updateAppointmentStatus(
    id,
    status,
    req.user.id
  );

  logger.info(`Appointment status updated: ${id} -> ${status}`);

  res.json({
    success: true,
    message: 'Appointment status updated successfully',
    data: appointment,
  });
});

/**
 * Cancel appointment
 * POST /api/appointments/:id/cancel
 */
export const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const appointment = await appointmentService.cancelAppointment(id, reason, req.user.id);

  logger.info(`Appointment cancelled: ${id}`);

  res.json({
    success: true,
    message: 'Appointment cancelled successfully',
    data: appointment,
  });
});

/**
 * Get available slots for doctor
 * GET /api/appointments/doctor/:doctorId/slots?date=YYYY-MM-DD
 */
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  const slots = await appointmentService.getAvailableSlots(doctorId, date);

  res.json({
    success: true,
    data: slots,
    count: slots.length,
  });
});

/**
 * Get appointment statistics
 * GET /api/appointments/stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export const getAppointmentStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const hospitalId = req.user.hospital_id;

  const stats = await appointmentService.getAppointmentStats(hospitalId, startDate, endDate);

  res.json({
    success: true,
    data: stats,
  });
});

export default {
  bookAppointment,
  getAppointment,
  getDoctorAppointments,
  getTodayAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots,
  getAppointmentStats,
};
