import Joi from 'joi';
import hearingService from '../services/hearing.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Case Hearing Controller
 * Handles HTTP requests for case hearing operations
 */

// Validation schemas
const createHearingSchema = Joi.object({
  case_id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid case ID format',
    'any.required': 'Case ID is required',
  }),
  hearing_date: Joi.date().required().messages({
    'any.required': 'Hearing date is required',
  }),
  hearing_time: Joi.string().allow(null, ''),
  court_name: Joi.string().max(255).allow(null, ''),
  judge_name: Joi.string().max(255).allow(null, ''),
  outcome: Joi.string().allow(null, ''),
  next_hearing_date: Joi.date().allow(null),
});

const updateHearingSchema = Joi.object({
  hearing_date: Joi.date(),
  hearing_time: Joi.string().allow(null, ''),
  court_name: Joi.string().max(255).allow(null, ''),
  judge_name: Joi.string().max(255).allow(null, ''),
  outcome: Joi.string().allow(null, ''),
  next_hearing_date: Joi.date().allow(null),
});

const recordOutcomeSchema = Joi.object({
  outcome: Joi.string().required().messages({
    'string.empty': 'Outcome is required',
    'any.required': 'Outcome is required',
  }),
  next_hearing_date: Joi.date().allow(null),
});

/**
 * Create a new hearing
 */
export const createHearing = asyncHandler(async (req, res) => {
  const { error, value } = createHearingSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const hearing = await hearingService.createHearing(value);

  res.status(201).json({
    success: true,
    message: 'Hearing created successfully',
    data: hearing,
  });
});

/**
 * Get hearing by ID
 */
export const getHearingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hearing = await hearingService.getHearingById(id);

  res.status(200).json({
    success: true,
    data: hearing,
  });
});

/**
 * Get all hearings with pagination
 */
export const getAllHearings = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    case_id: req.query.case_id,
    start_date: req.query.start_date,
    end_date: req.query.end_date,
    judge_name: req.query.judge_name,
  };

  const result = await hearingService.getAllHearings(options);

  res.status(200).json({
    success: true,
    ...result,
  });
});

/**
 * Get hearings by case ID
 */
export const getHearingsByCaseId = asyncHandler(async (req, res) => {
  const { caseId } = req.params;
  const hearings = await hearingService.getHearingsByCaseId(caseId);

  res.status(200).json({
    success: true,
    data: hearings,
  });
});

/**
 * Update hearing
 */
export const updateHearing = asyncHandler(async (req, res) => {
  const { error, value } = updateHearingSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const { id } = req.params;
  const hearing = await hearingService.updateHearing(id, value);

  res.status(200).json({
    success: true,
    message: 'Hearing updated successfully',
    data: hearing,
  });
});

/**
 * Delete hearing
 */
export const deleteHearing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hearing = await hearingService.deleteHearing(id);

  res.status(200).json({
    success: true,
    message: 'Hearing deleted successfully',
    data: hearing,
  });
});

/**
 * Get upcoming hearings
 */
export const getUpcomingHearings = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const firmId = req.query.firm_id || null;

  const hearings = await hearingService.getUpcomingHearings(days, firmId);

  res.status(200).json({
    success: true,
    data: hearings,
  });
});

/**
 * Get hearings by date range
 */
export const getHearingsByDateRange = asyncHandler(async (req, res) => {
  const { start_date, end_date } = req.query;
  const firmId = req.query.firm_id || null;

  if (!start_date || !end_date) {
    throw new ValidationError(['Start date and end date are required']);
  }

  const hearings = await hearingService.getHearingsByDateRange(
    new Date(start_date),
    new Date(end_date),
    firmId
  );

  res.status(200).json({
    success: true,
    data: hearings,
  });
});

/**
 * Get hearing statistics
 */
export const getHearingStatistics = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const startDate = req.query.start_date ? new Date(req.query.start_date) : null;
  const endDate = req.query.end_date ? new Date(req.query.end_date) : null;

  const stats = await hearingService.getHearingStatistics(firmId, startDate, endDate);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * Record hearing outcome
 */
export const recordHearingOutcome = asyncHandler(async (req, res) => {
  const { error, value } = recordOutcomeSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const { id } = req.params;
  const hearing = await hearingService.recordHearingOutcome(
    id,
    value.outcome,
    value.next_hearing_date
  );

  res.status(200).json({
    success: true,
    message: 'Hearing outcome recorded successfully',
    data: hearing,
  });
});
