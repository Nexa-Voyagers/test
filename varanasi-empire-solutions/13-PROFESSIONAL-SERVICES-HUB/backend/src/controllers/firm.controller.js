import Joi from 'joi';
import firmService from '../services/firm.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Service Firm Controller
 * Handles HTTP requests for service firm operations
 */

// Validation schemas
const createFirmSchema = Joi.object({
  firm_name: Joi.string().required().max(255).messages({
    'string.empty': 'Firm name is required',
    'any.required': 'Firm name is required',
  }),
  firm_type: Joi.string().valid('LEGAL', 'CONSULTING', 'ADVISORY', 'AUDIT').required().messages({
    'any.only': 'Firm type must be one of: LEGAL, CONSULTING, ADVISORY, AUDIT',
    'any.required': 'Firm type is required',
  }),
  registration_number: Joi.string().max(100).allow(null, ''),
  address: Joi.string().allow(null, ''),
  phone: Joi.string().max(20).allow(null, ''),
  email: Joi.string().email().max(255).allow(null, ''),
});

const updateFirmSchema = Joi.object({
  firm_name: Joi.string().max(255),
  firm_type: Joi.string().valid('LEGAL', 'CONSULTING', 'ADVISORY', 'AUDIT'),
  registration_number: Joi.string().max(100).allow(null, ''),
  address: Joi.string().allow(null, ''),
  phone: Joi.string().max(20).allow(null, ''),
  email: Joi.string().email().max(255).allow(null, ''),
  is_active: Joi.boolean(),
});

/**
 * @swagger
 * /api/v1/firms:
 *   post:
 *     summary: Create a new service firm
 *     tags: [Firms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firm_name
 *               - firm_type
 *     responses:
 *       201:
 *         description: Firm created successfully
 */
export const createFirm = asyncHandler(async (req, res) => {
  const { error, value } = createFirmSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const firm = await firmService.createFirm(value);

  res.status(201).json({
    success: true,
    message: 'Service firm created successfully',
    data: firm,
  });
});

/**
 * @swagger
 * /api/v1/firms/{id}:
 *   get:
 *     summary: Get firm by ID
 *     tags: [Firms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Firm retrieved successfully
 */
export const getFirmById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const firm = await firmService.getFirmById(id);

  res.status(200).json({
    success: true,
    data: firm,
  });
});

/**
 * @swagger
 * /api/v1/firms:
 *   get:
 *     summary: Get all firms with pagination
 *     tags: [Firms]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Firms retrieved successfully
 */
export const getAllFirms = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    firm_type: req.query.firm_type,
    is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
    search: req.query.search,
  };

  const result = await firmService.getAllFirms(options);

  res.status(200).json({
    success: true,
    ...result,
  });
});

/**
 * @swagger
 * /api/v1/firms/{id}:
 *   put:
 *     summary: Update firm
 *     tags: [Firms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Firm updated successfully
 */
export const updateFirm = asyncHandler(async (req, res) => {
  const { error, value } = updateFirmSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const { id } = req.params;
  const firm = await firmService.updateFirm(id, value);

  res.status(200).json({
    success: true,
    message: 'Service firm updated successfully',
    data: firm,
  });
});

/**
 * @swagger
 * /api/v1/firms/{id}:
 *   delete:
 *     summary: Delete firm (soft delete)
 *     tags: [Firms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Firm deleted successfully
 */
export const deleteFirm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const firm = await firmService.deleteFirm(id);

  res.status(200).json({
    success: true,
    message: 'Service firm deleted successfully',
    data: firm,
  });
});

/**
 * @swagger
 * /api/v1/firms/type/{firmType}:
 *   get:
 *     summary: Get firms by type
 *     tags: [Firms]
 *     parameters:
 *       - in: path
 *         name: firmType
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Firms retrieved successfully
 */
export const getFirmsByType = asyncHandler(async (req, res) => {
  const { firmType } = req.params;
  const firms = await firmService.getFirmsByType(firmType);

  res.status(200).json({
    success: true,
    data: firms,
  });
});

/**
 * @swagger
 * /api/v1/firms/{id}/statistics:
 *   get:
 *     summary: Get firm statistics
 *     tags: [Firms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
export const getFirmStatistics = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stats = await firmService.getFirmStatistics(id);

  res.status(200).json({
    success: true,
    data: stats,
  });
});
