import { asyncHandler } from '../utils/asyncHandler.js';
import measurementService from '../services/measurement.service.js';
import Joi from 'joi';
import { ValidationError } from '../utils/errors.js';

/**
 * Measurement Controller - Body Measurements & Progress Tracking
 */

const createMeasurementSchema = Joi.object({
  member_id: Joi.number().integer().required(),
  measurement_date: Joi.date(),
  weight_kg: Joi.number().min(0).max(500).required(),
  height_cm: Joi.number().min(0).max(300).required(),
  body_fat_percentage: Joi.number().min(0).max(100),
  chest_cm: Joi.number().min(0),
  waist_cm: Joi.number().min(0),
  hips_cm: Joi.number().min(0),
  biceps_cm: Joi.number().min(0),
  thighs_cm: Joi.number().min(0),
  notes: Joi.string()
});

const updateMeasurementSchema = Joi.object({
  measurement_date: Joi.date(),
  weight_kg: Joi.number().min(0).max(500),
  height_cm: Joi.number().min(0).max(300),
  body_fat_percentage: Joi.number().min(0).max(100),
  chest_cm: Joi.number().min(0),
  waist_cm: Joi.number().min(0),
  hips_cm: Joi.number().min(0),
  biceps_cm: Joi.number().min(0),
  thighs_cm: Joi.number().min(0),
  notes: Joi.string()
}).min(1);

export const createMeasurement = asyncHandler(async (req, res) => {
  const { error } = createMeasurementSchema.validate(req.body);
  if (error) throw new ValidationError(error.details.map(d => d.message));

  const measurement = await measurementService.createMeasurement(req.body);
  res.status(201).json({ success: true, message: 'Measurement recorded successfully', data: measurement });
});

export const getAllMeasurements = asyncHandler(async (req, res) => {
  const { member_id, start_date, end_date, page = 1, limit = 50 } = req.query;
  const filters = {
    member_id: member_id ? parseInt(member_id) : undefined,
    start_date,
    end_date,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  };

  const result = await measurementService.getAllMeasurements(filters);
  res.json({
    success: true,
    data: result.measurements,
    pagination: { total: result.total, page: result.page, limit: result.limit, pages: Math.ceil(result.total / result.limit) }
  });
});

export const getMeasurementById = asyncHandler(async (req, res) => {
  const measurement = await measurementService.getMeasurementById(parseInt(req.params.id));
  res.json({ success: true, data: measurement });
});

export const getMeasurementsByMember = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  const measurements = await measurementService.getMeasurementsByMember(parseInt(req.params.memberId), parseInt(limit));
  res.json({ success: true, data: measurements });
});

export const getLatestMeasurement = asyncHandler(async (req, res) => {
  const measurement = await measurementService.getLatestMeasurement(parseInt(req.params.memberId));
  res.json({ success: true, data: measurement });
});

export const getProgressReport = asyncHandler(async (req, res) => {
  const report = await measurementService.getProgressReport(parseInt(req.params.memberId));
  res.json({ success: true, data: report });
});

export const getMeasurementTrend = asyncHandler(async (req, res) => {
  const { metric = 'weight_kg', limit = 10 } = req.query;
  const trend = await measurementService.getMeasurementTrend(parseInt(req.params.memberId), metric, parseInt(limit));
  res.json({ success: true, data: trend });
});

export const updateMeasurement = asyncHandler(async (req, res) => {
  const { error } = updateMeasurementSchema.validate(req.body);
  if (error) throw new ValidationError(error.details.map(d => d.message));

  const measurement = await measurementService.updateMeasurement(parseInt(req.params.id), req.body);
  res.json({ success: true, message: 'Measurement updated successfully', data: measurement });
});

export const deleteMeasurement = asyncHandler(async (req, res) => {
  await measurementService.deleteMeasurement(parseInt(req.params.id));
  res.json({ success: true, message: 'Measurement deleted successfully' });
});

export const calculateBMI = asyncHandler(async (req, res) => {
  const { weight_kg, height_cm } = req.query;
  if (!weight_kg || !height_cm) {
    throw new ValidationError(['weight_kg and height_cm are required']);
  }

  const result = measurementService.calculateBMI(parseFloat(weight_kg), parseFloat(height_cm));
  res.json({ success: true, data: result });
});

export const getBMIDistribution = asyncHandler(async (req, res) => {
  const { gym_id } = req.query;
  const distribution = await measurementService.getBMIDistribution(gym_id ? parseInt(gym_id) : null);
  res.json({ success: true, data: distribution });
});

export default {
  createMeasurement,
  getAllMeasurements,
  getMeasurementById,
  getMeasurementsByMember,
  getLatestMeasurement,
  getProgressReport,
  getMeasurementTrend,
  updateMeasurement,
  deleteMeasurement,
  calculateBMI,
  getBMIDistribution
};
