import { doctorRepository } from '../repositories/doctor.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../utils/errors.js';
import { logger } from '../config/logger.js';

export const getDoctors = asyncHandler(async (req, res) => {
  const hospitalId = req.user.hospital_id;
  const filters = req.query;

  const doctors = await doctorRepository.findByHospital(hospitalId, filters);

  res.json({
    success: true,
    data: doctors,
    count: doctors.length,
  });
});

export const getDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctor = await doctorRepository.findById(id);

  if (!doctor) {
    throw new NotFoundError('Doctor');
  }

  res.json({
    success: true,
    data: doctor,
  });
});

export const createDoctor = asyncHandler(async (req, res) => {
  const doctorData = {
    ...req.body,
    hospital_id: req.user.hospital_id,
    created_by: req.user.id,
    doctor_code: `DOC-${Date.now()}`,
  };

  const doctor = await doctorRepository.create(doctorData);

  logger.info(`Doctor created: ${doctor.doctor_code}`);

  res.status(201).json({
    success: true,
    message: 'Doctor created successfully',
    data: doctor,
  });
});

export const updateDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctor = await doctorRepository.update(id, req.body);

  logger.info(`Doctor updated: ${id}`);

  res.json({
    success: true,
    message: 'Doctor updated successfully',
    data: doctor,
  });
});

export default { getDoctors, getDoctor, createDoctor, updateDoctor };
