import Joi from 'joi';
import clientService from '../services/client.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Client Controller
 * Handles HTTP requests for client operations
 */

// Validation schemas
const createClientSchema = Joi.object({
  client_code: Joi.string().required().max(50).messages({
    'string.empty': 'Client code is required',
    'any.required': 'Client code is required',
  }),
  client_type: Joi.string().valid('INDIVIDUAL', 'CORPORATE').required().messages({
    'any.only': 'Client type must be either INDIVIDUAL or CORPORATE',
    'any.required': 'Client type is required',
  }),
  first_name: Joi.string().max(100).when('client_type', {
    is: 'INDIVIDUAL',
    then: Joi.required(),
    otherwise: Joi.allow(null, ''),
  }),
  last_name: Joi.string().max(100).allow(null, ''),
  company_name: Joi.string().max(255).when('client_type', {
    is: 'CORPORATE',
    then: Joi.required(),
    otherwise: Joi.allow(null, ''),
  }),
  phone: Joi.string().required().max(20).messages({
    'string.empty': 'Phone is required',
    'any.required': 'Phone is required',
  }),
  email: Joi.string().email().max(255).allow(null, ''),
  address: Joi.string().allow(null, ''),
});

const updateClientSchema = Joi.object({
  client_type: Joi.string().valid('INDIVIDUAL', 'CORPORATE'),
  first_name: Joi.string().max(100).allow(null, ''),
  last_name: Joi.string().max(100).allow(null, ''),
  company_name: Joi.string().max(255).allow(null, ''),
  phone: Joi.string().max(20),
  email: Joi.string().email().max(255).allow(null, ''),
  address: Joi.string().allow(null, ''),
  is_active: Joi.boolean(),
});

/**
 * Create a new client
 */
export const createClient = asyncHandler(async (req, res) => {
  const { error, value } = createClientSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const client = await clientService.createClient(value);

  res.status(201).json({
    success: true,
    message: 'Client created successfully',
    data: client,
  });
});

/**
 * Get client by ID
 */
export const getClientById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await clientService.getClientById(id);

  res.status(200).json({
    success: true,
    data: client,
  });
});

/**
 * Get all clients with pagination
 */
export const getAllClients = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    client_type: req.query.client_type,
    is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
    search: req.query.search,
  };

  const result = await clientService.getAllClients(options);

  res.status(200).json({
    success: true,
    ...result,
  });
});

/**
 * Update client
 */
export const updateClient = asyncHandler(async (req, res) => {
  const { error, value } = updateClientSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const { id } = req.params;
  const client = await clientService.updateClient(id, value);

  res.status(200).json({
    success: true,
    message: 'Client updated successfully',
    data: client,
  });
});

/**
 * Delete client (soft delete)
 */
export const deleteClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await clientService.deleteClient(id);

  res.status(200).json({
    success: true,
    message: 'Client deleted successfully',
    data: client,
  });
});

/**
 * Get client statistics
 */
export const getClientStatistics = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stats = await clientService.getClientStatistics(id);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * Search clients
 */
export const searchClients = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new ValidationError(['Search query is required']);
  }

  const clients = await clientService.searchClients(query);

  res.status(200).json({
    success: true,
    data: clients,
  });
});

/**
 * Get clients with outstanding payments
 */
export const getClientsWithOutstandingPayments = asyncHandler(async (req, res) => {
  const clients = await clientService.getClientsWithOutstandingPayments();

  res.status(200).json({
    success: true,
    data: clients,
  });
});
