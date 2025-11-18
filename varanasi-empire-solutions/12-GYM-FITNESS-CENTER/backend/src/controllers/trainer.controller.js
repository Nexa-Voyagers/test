import { asyncHandler } from '../utils/asyncHandler.js';
import trainerService from '../services/trainer.service.js';
import Joi from 'joi';
import { ValidationError } from '../utils/errors.js';

/**
 * Trainer Controller
 */

const createTrainerSchema = Joi.object({
  gym_id: Joi.number().integer().required(),
  first_name: Joi.string().required().max(100),
  last_name: Joi.string().required().max(100),
  email: Joi.string().email().required().max(255),
  phone: Joi.string().required().max(15),
  specialization: Joi.string().max(255),
  certifications: Joi.string(),
  experience_years: Joi.number().integer().min(0),
  hourly_rate: Joi.number().min(0),
  photo_url: Joi.string().max(500),
  bio: Joi.string()
});

const updateTrainerSchema = Joi.object({
  gym_id: Joi.number().integer(),
  first_name: Joi.string().max(100),
  last_name: Joi.string().max(100),
  email: Joi.string().email().max(255),
  phone: Joi.string().max(15),
  specialization: Joi.string().max(255),
  certifications: Joi.string(),
  experience_years: Joi.number().integer().min(0),
  hourly_rate: Joi.number().min(0),
  photo_url: Joi.string().max(500),
  bio: Joi.string(),
  is_active: Joi.boolean()
}).min(1);

export const createTrainer = asyncHandler(async (req, res) => {
  const { error } = createTrainerSchema.validate(req.body);
  if (error) throw new ValidationError(error.details.map(d => d.message));

  const trainer = await trainerService.createTrainer(req.body);
  res.status(201).json({ success: true, message: 'Trainer created successfully', data: trainer });
});

export const getAllTrainers = asyncHandler(async (req, res) => {
  const { gym_id, specialization, is_active, search, page = 1, limit = 50 } = req.query;
  const filters = {
    gym_id: gym_id ? parseInt(gym_id) : undefined,
    specialization,
    is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
    search,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  };

  const result = await trainerService.getAllTrainers(filters);
  res.json({
    success: true,
    data: result.trainers,
    pagination: { total: result.total, page: result.page, limit: result.limit, pages: Math.ceil(result.total / result.limit) }
  });
});

export const getTrainerById = asyncHandler(async (req, res) => {
  const trainer = await trainerService.getTrainerById(parseInt(req.params.id));
  res.json({ success: true, data: trainer });
});

export const getTrainerWithStats = asyncHandler(async (req, res) => {
  const trainer = await trainerService.getTrainerWithStats(parseInt(req.params.id));
  res.json({ success: true, data: trainer });
});

export const updateTrainer = asyncHandler(async (req, res) => {
  const { error } = updateTrainerSchema.validate(req.body);
  if (error) throw new ValidationError(error.details.map(d => d.message));

  const trainer = await trainerService.updateTrainer(parseInt(req.params.id), req.body);
  res.json({ success: true, message: 'Trainer updated successfully', data: trainer });
});

export const deleteTrainer = asyncHandler(async (req, res) => {
  await trainerService.deleteTrainer(parseInt(req.params.id));
  res.json({ success: true, message: 'Trainer deleted successfully' });
});

export const checkAvailability = asyncHandler(async (req, res) => {
  const { trainer_id, session_date, start_time, end_time } = req.query;
  if (!trainer_id || !session_date || !start_time || !end_time) {
    throw new ValidationError(['trainer_id, session_date, start_time, and end_time are required']);
  }

  const isAvailable = await trainerService.checkAvailability(
    parseInt(trainer_id), session_date, start_time, end_time
  );
  res.json({ success: true, data: { available: isAvailable } });
});

export const getTrainerSchedule = asyncHandler(async (req, res) => {
  const { start_date, end_date } = req.query;
  if (!start_date || !end_date) {
    throw new ValidationError(['start_date and end_date are required']);
  }

  const schedule = await trainerService.getTrainerSchedule(parseInt(req.params.id), start_date, end_date);
  res.json({ success: true, data: schedule });
});

export default {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  getTrainerWithStats,
  updateTrainer,
  deleteTrainer,
  checkAvailability,
  getTrainerSchedule
};
