import { asyncHandler } from '../utils/asyncHandler.js';
import workoutService from '../services/workout.service.js';
import Joi from 'joi';
import { ValidationError } from '../utils/errors.js';

/**
 * Workout Plan Controller
 */

const exerciseSchema = Joi.object({
  exercise: Joi.string().required(),
  sets: Joi.number().integer().required(),
  reps: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  rest: Joi.string().required(),
  notes: Joi.string()
});

const createWorkoutPlanSchema = Joi.object({
  member_id: Joi.number().integer().required(),
  trainer_id: Joi.number().integer(),
  plan_name: Joi.string().required().max(255),
  description: Joi.string(),
  start_date: Joi.date().required(),
  end_date: Joi.date(),
  difficulty_level: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
  workout_schedule: Joi.object({
    monday: Joi.array().items(exerciseSchema),
    tuesday: Joi.array().items(exerciseSchema),
    wednesday: Joi.array().items(exerciseSchema),
    thursday: Joi.array().items(exerciseSchema),
    friday: Joi.array().items(exerciseSchema),
    saturday: Joi.array().items(exerciseSchema),
    sunday: Joi.array().items(exerciseSchema)
  }).required(),
  notes: Joi.string()
});

const updateWorkoutPlanSchema = Joi.object({
  trainer_id: Joi.number().integer(),
  plan_name: Joi.string().max(255),
  description: Joi.string(),
  start_date: Joi.date(),
  end_date: Joi.date(),
  difficulty_level: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
  workout_schedule: Joi.object({
    monday: Joi.array().items(exerciseSchema),
    tuesday: Joi.array().items(exerciseSchema),
    wednesday: Joi.array().items(exerciseSchema),
    thursday: Joi.array().items(exerciseSchema),
    friday: Joi.array().items(exerciseSchema),
    saturday: Joi.array().items(exerciseSchema),
    sunday: Joi.array().items(exerciseSchema)
  }),
  notes: Joi.string(),
  is_active: Joi.boolean()
}).min(1);

export const createWorkoutPlan = asyncHandler(async (req, res) => {
  const { error } = createWorkoutPlanSchema.validate(req.body);
  if (error) throw new ValidationError(error.details.map(d => d.message));

  const plan = await workoutService.createWorkoutPlan(req.body);
  res.status(201).json({ success: true, message: 'Workout plan created successfully', data: plan });
});

export const getAllWorkoutPlans = asyncHandler(async (req, res) => {
  const { member_id, trainer_id, difficulty_level, is_active, page = 1, limit = 50 } = req.query;
  const filters = {
    member_id: member_id ? parseInt(member_id) : undefined,
    trainer_id: trainer_id ? parseInt(trainer_id) : undefined,
    difficulty_level,
    is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  };

  const result = await workoutService.getAllWorkoutPlans(filters);
  res.json({
    success: true,
    data: result.plans,
    pagination: { total: result.total, page: result.page, limit: result.limit, pages: Math.ceil(result.total / result.limit) }
  });
});

export const getWorkoutPlanById = asyncHandler(async (req, res) => {
  const plan = await workoutService.getWorkoutPlanById(parseInt(req.params.id));
  res.json({ success: true, data: plan });
});

export const getActiveWorkoutPlan = asyncHandler(async (req, res) => {
  const plan = await workoutService.getActiveWorkoutPlan(parseInt(req.params.memberId));
  res.json({ success: true, data: plan });
});

export const getWorkoutPlansByMember = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  const plans = await workoutService.getWorkoutPlansByMember(parseInt(req.params.memberId), parseInt(limit));
  res.json({ success: true, data: plans });
});

export const getWorkoutPlansByTrainer = asyncHandler(async (req, res) => {
  const { active_only = 'false' } = req.query;
  const plans = await workoutService.getWorkoutPlansByTrainer(parseInt(req.params.trainerId), active_only === 'true');
  res.json({ success: true, data: plans });
});

export const updateWorkoutPlan = asyncHandler(async (req, res) => {
  const { error } = updateWorkoutPlanSchema.validate(req.body);
  if (error) throw new ValidationError(error.details.map(d => d.message));

  const plan = await workoutService.updateWorkoutPlan(parseInt(req.params.id), req.body);
  res.json({ success: true, message: 'Workout plan updated successfully', data: plan });
});

export const deactivateWorkoutPlan = asyncHandler(async (req, res) => {
  const plan = await workoutService.deactivateWorkoutPlan(parseInt(req.params.id));
  res.json({ success: true, message: 'Workout plan deactivated successfully', data: plan });
});

export const deleteWorkoutPlan = asyncHandler(async (req, res) => {
  await workoutService.deleteWorkoutPlan(parseInt(req.params.id));
  res.json({ success: true, message: 'Workout plan deleted successfully' });
});

export const getWorkoutScheduleByDay = asyncHandler(async (req, res) => {
  const { day } = req.params;
  const workouts = await workoutService.getWorkoutScheduleByDay(parseInt(req.params.id), day);
  res.json({ success: true, data: workouts });
});

export const getWorkoutPlanStatistics = asyncHandler(async (req, res) => {
  const { trainer_id, gym_id } = req.query;
  const filters = {
    trainer_id: trainer_id ? parseInt(trainer_id) : undefined,
    gym_id: gym_id ? parseInt(gym_id) : undefined
  };

  const stats = await workoutService.getWorkoutPlanStatistics(filters);
  res.json({ success: true, data: stats });
});

export default {
  createWorkoutPlan,
  getAllWorkoutPlans,
  getWorkoutPlanById,
  getActiveWorkoutPlan,
  getWorkoutPlansByMember,
  getWorkoutPlansByTrainer,
  updateWorkoutPlan,
  deactivateWorkoutPlan,
  deleteWorkoutPlan,
  getWorkoutScheduleByDay,
  getWorkoutPlanStatistics
};
