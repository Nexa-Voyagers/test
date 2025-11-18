import { appointmentRepository } from '../repositories/appointment.repository.js';
import { patientRepository } from '../repositories/patient.repository.js';
import { doctorRepository } from '../repositories/doctor.repository.js';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors.js';
import { generateAppointmentId } from '../utils/idGenerator.js';

/**
 * Book appointment
 */
const bookAppointment = async (appointmentData) => {
  // Verify patient exists
  const patient = await patientRepository.findById(appointmentData.patient_id);
  if (!patient) {
    throw new NotFoundError('Patient');
  }

  // Verify doctor exists
  const doctor = await doctorRepository.findById(appointmentData.doctor_id);
  if (!doctor) {
    throw new NotFoundError('Doctor');
  }

  // Check slot availability
  const isAvailable = await appointmentRepository.checkSlotAvailability(
    appointmentData.doctor_id,
    appointmentData.appointment_date,
    appointmentData.appointment_time
  );

  if (!isAvailable) {
    throw new ConflictError('This time slot is already booked. Please choose another time.');
  }

  // Generate appointment ID
  const appointmentId = generateAppointmentId();

  const appointment = await appointmentRepository.create({
    ...appointmentData,
    appointment_id: appointmentId,
  });

  // Record patient visit
  await patientRepository.incrementVisitCount(appointmentData.patient_id);

  return appointment;
};

/**
 * Get appointment details
 */
const getAppointment = async (id) => {
  const appointment = await appointmentRepository.findById(id);
  if (!appointment) {
    throw new NotFoundError('Appointment');
  }
  return appointment;
};

/**
 * Get appointments by date and doctor
 */
const getDoctorAppointments = async (doctorId, appointmentDate) => {
  const appointments = await appointmentRepository.findByDateAndDoctor(
    doctorId,
    appointmentDate
  );
  return appointments;
};

/**
 * Get today's appointments for doctor
 */
const getTodayAppointments = async (doctorId) => {
  const appointments = await appointmentRepository.getTodayAppointments(doctorId);
  return appointments;
};

/**
 * Update appointment status
 */
const updateAppointmentStatus = async (id, status, updatedBy) => {
  const appointment = await appointmentRepository.findById(id);
  if (!appointment) {
    throw new NotFoundError('Appointment');
  }

  const validStatuses = ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError([{ field: 'status', message: 'Invalid status' }]);
  }

  const updatedAppointment = await appointmentRepository.updateStatus(id, status, updatedBy);
  return updatedAppointment;
};

/**
 * Cancel appointment
 */
const cancelAppointment = async (id, reason, cancelledBy) => {
  const appointment = await appointmentRepository.findById(id);
  if (!appointment) {
    throw new NotFoundError('Appointment');
  }

  if (appointment.status === 'COMPLETED') {
    throw new ValidationError([
      { field: 'status', message: 'Cannot cancel a completed appointment' },
    ]);
  }

  const updatedAppointment = await appointmentRepository.updateStatus(id, 'CANCELLED', cancelledBy);
  return updatedAppointment;
};

/**
 * Get available slots for doctor
 */
const getAvailableSlots = async (doctorId, date) => {
  const schedules = await doctorRepository.getAvailableSlots(doctorId, date);

  // Get booked appointments for the date
  const bookedAppointments = await appointmentRepository.findByDateAndDoctor(doctorId, date);

  // Filter out booked slots
  const availableSlots = schedules.filter((schedule) => {
    return !bookedAppointments.some(
      (apt) => apt.appointment_time === schedule.slot_time
    );
  });

  return availableSlots;
};

/**
 * Get appointment statistics
 */
const getAppointmentStats = async (hospitalId, startDate, endDate) => {
  const stats = await appointmentRepository.getStats(hospitalId, startDate, endDate);
  return stats;
};

export const appointmentService = {
  bookAppointment,
  getAppointment,
  getDoctorAppointments,
  getTodayAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots,
  getAppointmentStats,
};

export default appointmentService;
