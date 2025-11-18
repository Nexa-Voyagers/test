import { asyncHandler } from '../utils/asyncHandler.js';
import dietService from '../services/diet.service.js';
import Joi from 'joi';
import { ValidationError } from '../utils/errors.js';

/**
 * Diet Plan Controller
 */

const mealItemSchema = Joi.object({
  meal: Joi.string().required(),
  time: Joi.string().required(),
  items: Joi.array().items(Joi.string()).required(),
  calories: Joi.number().required()
});

const createDietPlanSchema = Joi.object({
  member_id: Joi.number().integer().required(),
  trainer_id: Joi.number().integer(),
  plan_name: Joi.string().required().max(255),
  description: Joi.string(),
  start_date: Joi.date().required(),
  end_date: Joi.date(),
  daily_calories: Joi.number().min(0).max(10000),
  meal_plan: Joi.object({
    monday: Joi.array().items(mealItemSchema),
    tuesday: Joi.array().items(mealItemSchema),
    wednesday: Joi.array().items(mealItemSchema),
    thursday: Joi.array().items(mealItemSchema),
    friday: Joi.array().items(mealItemSchema),
    saturday: Joi.array().items(mealItemSchema),
    sunday: Joi.array().items(mealItemSchema)
  }).required(),
  notes: Joi.string()
});

const updateDietPlanSchema = Joi.object({
  trainer_id: Joi.number().integer(),
  plan_name: Joi.string().max(255),
  description: Joi.string(),
  start_date: Joi.date(),
  end_date: Joi.date(),
  daily_calories: Joi.number().min(0).max(10000),
  meal_plan: Joi.object({
    monday: Joi.array().items(mealItemSchema),
    tuesday: Joi.array().items(mealItemSchema),
    wednesday: Joi.array().items(mealItemSchema),
    thursday: Joi.array().items(mealItemSchema),
    friday: Joi.array().items(mealItemSchema),
    saturday: Joi.array().items(mealItemSchema),
    sunday: Joi.array().items(mealItemSchema)
  }),
  notes: Joi.string(),
  is_active: Joi.boolean()
}).min(1);

export const createDietPlan = asyncHandler(async (req, res) => {
  const { error } = createDietPlanSchema.validate(req.body);
  if (error) throw new ValidationError(error.details.map(d => d.message));

  const plan = await dietService.createDietPlan(req.body);
  res.status(201).json({ success: true, message: 'Diet plan created successfully', data: plan });
});

export const getAllDietPlans = asyncHandler(async (req, res) => {
  const { member_id, trainer_id, is_active, page = 1, limit = 50 } = req.query;
  const filters = {
    member_id: member_id ? parseInt(member_id) : undefined,
    trainer_id: trainer_id ? parseInt(trainer_id) : undefined,
    is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  };

  const result = await dietService.getAllDietPlans(filters);
  res.json({
    success: true,
    data: result.plans,
    pagination: { total: result.total, page: result.page, limit: result.limit, pages: Math.ceil(result.total / result.limit) }
  });
});

export const getDietPlanById = asyncHandler(async (req, res) => {
  const plan = await dietService.getDietPlanById(parseInt(req.params.id));
  res.json({ success: true, data: plan });
});

export const getActiveDietPlan = asyncHandler(async (req, res) => {
  const plan = await dietService.getActiveDietPlan(parseInt(req.params.memberId));
  res.json({ success: true, data: plan });
});

export const getDietPlansByMember = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  const plans = await dietService.getDietPlansByMember(parseInt(req.params.memberId), parseInt(limit));
  res.json({ success: true, data: plans });
});

export const getDietPlansByTrainer = asyncHandler(async (req, res) => {
  const { active_only = 'false' } = req.query;
  const plans = await dietService.getDietPlansByTrainer(parseInt(req.params.trainerId), active_only === 'true');
  res.json({ success: true, data: plans });
});

export const updateDietPlan = asyncHandler(async (req, res) => {
  const { error } = updateDietPlanSchema.validate(req.body);
  if (error) throw new ValidationError(error.details.map(d => d.message));

  const plan = await dietService.updateDietPlan(parseInt(req.params.id), req.body);
  res.json({ success: true, message: 'Diet plan updated successfully', data: plan });
});

export const deactivateDietPlan = asyncHandler(async (req, res) => {
  const plan = await dietService.deactivateDietPlan(parseInt(req.params.id));
  res.json({ success: true, message: 'Diet plan deactivated successfully', data: plan });
});

export const deleteDietPlan = asyncHandler(async (req, res) => {
  await dietService.deleteDietPlan(parseInt(req.params.id));
  res.json({ success: true, message: 'Diet plan deleted successfully' });
});

export const getMealPlanByDay = asyncHandler(async (req, res) => {
  const { day } = req.params;
  const meals = await dietService.getMealPlanByDay(parseInt(req.params.id), day);
  res.json({ success: true, data: meals });
});

export const getDietPlanStatistics = asyncHandler(async (req, res) => {
  const { trainer_id, gym_id } = req.query;
  const filters = {
    trainer_id: trainer_id ? parseInt(trainer_id) : undefined,
    gym_id: gym_id ? parseInt(gym_id) : undefined
  };

  const stats = await dietService.getDietPlanStatistics(filters);
  res.json({ success: true, data: stats });
});

export default {
  createDietPlan,
  getAllDietPlans,
  getDietPlanById,
  getActiveDietPlan,
  getDietPlansByMember,
  getDietPlansByTrainer,
  updateDietPlan,
  deactivateDietPlan,
  deleteDietPlan,
  getMealPlanByDay,
  getDietPlanStatistics
};
