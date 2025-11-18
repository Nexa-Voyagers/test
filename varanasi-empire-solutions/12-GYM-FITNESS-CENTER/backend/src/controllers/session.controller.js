import { asyncHandler } from '../utils/asyncHandler.js';
import sessionService from '../services/session.service.js';
import Joi from 'joi';
import { ValidationError } from '../utils/errors.js';

/**
 * Session Controller - Personal Training Sessions
 */

const createSessionSchema = Joi.object({
  member_id: Joi.number().integer().required(),
  trainer_id: Joi.number().integer().required(),
  session_date: Joi.date().required(),
  start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  session_fee: Joi.number().min(0),
  session_type: Joi.string().max(100),
  notes: Joi.string()
});

const updateSessionSchema = Joi.object({
  trainer_id: Joi.number().integer(),
  session_date: Joi.date(),
  start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  session_fee: Joi.number().min(0),
  session_type: Joi.string().max(100),
  notes: Joi.string(),
  status: Joi.string().valid('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'),
  feedback: Joi.string()
}).min(1);

export const createSession = asyncHandler(async (req, res) => {
  const { error } = createSessionSchema.validate(req.body);
  if (error) throw new ValidationError(error.details.map(d => d.message));

  const session = await sessionService.createSession(req.body);
  res.status(201).json({ success: true, message: 'Session scheduled successfully', data: session });
});

export const getAllSessions = asyncHandler(async (req, res) => {
  const { member_id, trainer_id, status, session_date, gym_id, page = 1, limit = 50 } = req.query;
  const filters = {
    member_id: member_id ? parseInt(member_id) : undefined,
    trainer_id: trainer_id ? parseInt(trainer_id) : undefined,
    status,
    session_date,
    gym_id: gym_id ? parseInt(gym_id) : undefined,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  };

  const result = await sessionService.getAllSessions(filters);
  res.json({
    success: true,
    data: result.sessions,
    pagination: { total: result.total, page: result.page, limit: result.limit, pages: Math.ceil(result.total / result.limit) }
  });
});

export const getSessionById = asyncHandler(async (req, res) => {
  const session = await sessionService.getSessionById(parseInt(req.params.id));
  res.json({ success: true, data: session });
});

export const updateSession = asyncHandler(async (req, res) => {
  const { error } = updateSessionSchema.validate(req.body);
  if (error) throw new ValidationError(error.details.map(d => d.message));

  const session = await sessionService.updateSession(parseInt(req.params.id), req.body);
  res.json({ success: true, message: 'Session updated successfully', data: session });
});

export const completeSession = asyncHandler(async (req, res) => {
  const { feedback } = req.body;
  const session = await sessionService.completeSession(parseInt(req.params.id), feedback);
  res.json({ success: true, message: 'Session completed successfully', data: session });
});

export const cancelSession = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason) throw new ValidationError(['Cancellation reason is required']);

  const session = await sessionService.cancelSession(parseInt(req.params.id), reason);
  res.json({ success: true, message: 'Session cancelled successfully', data: session });
});

export const markNoShow = asyncHandler(async (req, res) => {
  const session = await sessionService.markNoShow(parseInt(req.params.id));
  res.json({ success: true, message: 'Session marked as no-show', data: session });
});

export const getUpcomingSessionsByMember = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const sessions = await sessionService.getUpcomingSessionsByMember(parseInt(req.params.memberId), parseInt(limit));
  res.json({ success: true, data: sessions });
});

export const getUpcomingSessionsByTrainer = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  const sessions = await sessionService.getUpcomingSessionsByTrainer(parseInt(req.params.trainerId), parseInt(limit));
  res.json({ success: true, data: sessions });
});

export const getSessionStatistics = asyncHandler(async (req, res) => {
  const { trainer_id, member_id, gym_id, start_date, end_date } = req.query;
  const filters = {
    trainer_id: trainer_id ? parseInt(trainer_id) : undefined,
    member_id: member_id ? parseInt(member_id) : undefined,
    gym_id: gym_id ? parseInt(gym_id) : undefined,
    start_date,
    end_date
  };

  const stats = await sessionService.getSessionStatistics(filters);
  res.json({ success: true, data: stats });
});

export default {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  completeSession,
  cancelSession,
  markNoShow,
  getUpcomingSessionsByMember,
  getUpcomingSessionsByTrainer,
  getSessionStatistics
};
