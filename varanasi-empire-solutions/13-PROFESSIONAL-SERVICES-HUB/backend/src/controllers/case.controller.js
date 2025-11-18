import Joi from 'joi';
import caseService from '../services/case.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Case Controller
 * Handles HTTP requests for case operations
 */

// Validation schemas
const createCaseSchema = Joi.object({
  firm_id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid firm ID format',
    'any.required': 'Firm ID is required',
  }),
  client_id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid client ID format',
    'any.required': 'Client ID is required',
  }),
  case_number: Joi.string().required().max(50).messages({
    'string.empty': 'Case number is required',
    'any.required': 'Case number is required',
  }),
  case_title: Joi.string().max(500).allow(null, ''),
  case_type: Joi.string().max(100).allow(null, ''),
  court_name: Joi.string().max(255).allow(null, ''),
  case_status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'ON_HOLD', 'CLOSED', 'WON', 'LOST').default('OPEN'),
  filing_date: Joi.date().allow(null),
  next_hearing_date: Joi.date().allow(null),
  assigned_to: Joi.string().uuid().allow(null),
  initial_hearing: Joi.object({
    hearing_date: Joi.date().required(),
    hearing_time: Joi.string().allow(null),
    court_name: Joi.string().max(255).allow(null),
    judge_name: Joi.string().max(255).allow(null),
    next_hearing_date: Joi.date().allow(null),
  }).allow(null),
});

const updateCaseSchema = Joi.object({
  case_title: Joi.string().max(500).allow(null, ''),
  case_type: Joi.string().max(100).allow(null, ''),
  court_name: Joi.string().max(255).allow(null, ''),
  case_status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'ON_HOLD', 'CLOSED', 'WON', 'LOST'),
  next_hearing_date: Joi.date().allow(null),
  assigned_to: Joi.string().uuid().allow(null),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'ON_HOLD', 'CLOSED', 'WON', 'LOST').required().messages({
    'any.only': 'Status must be one of: OPEN, IN_PROGRESS, ON_HOLD, CLOSED, WON, LOST',
    'any.required': 'Status is required',
  }),
});

/**
 * Create a new case
 */
export const createCase = asyncHandler(async (req, res) => {
  const { error, value } = createCaseSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const { initial_hearing, ...caseData } = value;
  const caseRecord = await caseService.createCase(caseData, initial_hearing);

  res.status(201).json({
    success: true,
    message: 'Case created successfully',
    data: caseRecord,
  });
});

/**
 * Get case by ID
 */
export const getCaseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const caseRecord = await caseService.getCaseById(id);

  res.status(200).json({
    success: true,
    data: caseRecord,
  });
});

/**
 * Get all cases with pagination
 */
export const getAllCases = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    firm_id: req.query.firm_id,
    client_id: req.query.client_id,
    assigned_to: req.query.assigned_to,
    case_status: req.query.case_status,
    case_type: req.query.case_type,
    search: req.query.search,
  };

  const result = await caseService.getAllCases(options);

  res.status(200).json({
    success: true,
    ...result,
  });
});

/**
 * Update case
 */
export const updateCase = asyncHandler(async (req, res) => {
  const { error, value } = updateCaseSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const { id } = req.params;
  const caseRecord = await caseService.updateCase(id, value);

  res.status(200).json({
    success: true,
    message: 'Case updated successfully',
    data: caseRecord,
  });
});

/**
 * Update case status
 */
export const updateCaseStatus = asyncHandler(async (req, res) => {
  const { error, value } = updateStatusSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const { id } = req.params;
  const caseRecord = await caseService.updateCaseStatus(id, value.status);

  res.status(200).json({
    success: true,
    message: 'Case status updated successfully',
    data: caseRecord,
  });
});

/**
 * Delete case
 */
export const deleteCase = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const caseRecord = await caseService.deleteCase(id);

  res.status(200).json({
    success: true,
    message: 'Case deleted successfully',
    data: caseRecord,
  });
});

/**
 * Get upcoming hearings
 */
export const getUpcomingHearings = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const days = parseInt(req.query.days) || 7;

  const cases = await caseService.getUpcomingHearings(firmId, days);

  res.status(200).json({
    success: true,
    data: cases,
  });
});

/**
 * Get old cases
 */
export const getOldCases = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 90;
  const firmId = req.query.firm_id || null;

  const cases = await caseService.getOldCases(days, firmId);

  res.status(200).json({
    success: true,
    data: cases,
  });
});

/**
 * Get case statistics
 */
export const getCaseStatistics = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const stats = await caseService.getCaseStatistics(firmId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});
