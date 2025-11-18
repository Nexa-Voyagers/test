import Joi from 'joi';
import invoiceService from '../services/invoice.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Invoice Controller
 * Handles HTTP requests for invoice operations
 */

// Validation schemas
const createInvoiceSchema = Joi.object({
  case_id: Joi.string().uuid().allow(null),
  client_id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid client ID format',
    'any.required': 'Client ID is required',
  }),
  invoice_number: Joi.string().required().max(50).messages({
    'string.empty': 'Invoice number is required',
    'any.required': 'Invoice number is required',
  }),
  invoice_date: Joi.date().required().messages({
    'any.required': 'Invoice date is required',
  }),
  total_amount: Joi.number().min(0).required().messages({
    'number.min': 'Total amount must be greater than or equal to 0',
    'any.required': 'Total amount is required',
  }),
  payment_status: Joi.string().valid('PENDING', 'PARTIAL', 'PAID').default('PENDING'),
});

const updateInvoiceSchema = Joi.object({
  total_amount: Joi.number().min(0),
  payment_status: Joi.string().valid('PENDING', 'PARTIAL', 'PAID'),
});

const updatePaymentStatusSchema = Joi.object({
  payment_status: Joi.string().valid('PENDING', 'PARTIAL', 'PAID').required().messages({
    'any.only': 'Payment status must be one of: PENDING, PARTIAL, PAID',
    'any.required': 'Payment status is required',
  }),
});

/**
 * Create a new invoice
 */
export const createInvoice = asyncHandler(async (req, res) => {
  const { error, value } = createInvoiceSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const invoice = await invoiceService.createInvoice(value);

  res.status(201).json({
    success: true,
    message: 'Invoice created successfully',
    data: invoice,
  });
});

/**
 * Get invoice by ID
 */
export const getInvoiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const invoice = await invoiceService.getInvoiceById(id);

  res.status(200).json({
    success: true,
    data: invoice,
  });
});

/**
 * Get all invoices with pagination
 */
export const getAllInvoices = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    case_id: req.query.case_id,
    client_id: req.query.client_id,
    payment_status: req.query.payment_status,
    start_date: req.query.start_date,
    end_date: req.query.end_date,
    search: req.query.search,
  };

  const result = await invoiceService.getAllInvoices(options);

  res.status(200).json({
    success: true,
    ...result,
  });
});

/**
 * Update invoice
 */
export const updateInvoice = asyncHandler(async (req, res) => {
  const { error, value } = updateInvoiceSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const { id } = req.params;
  const invoice = await invoiceService.updateInvoice(id, value);

  res.status(200).json({
    success: true,
    message: 'Invoice updated successfully',
    data: invoice,
  });
});

/**
 * Update payment status
 */
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { error, value } = updatePaymentStatusSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const { id } = req.params;
  const invoice = await invoiceService.updatePaymentStatus(id, value.payment_status);

  res.status(200).json({
    success: true,
    message: 'Payment status updated successfully',
    data: invoice,
  });
});

/**
 * Delete invoice
 */
export const deleteInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const invoice = await invoiceService.deleteInvoice(id);

  res.status(200).json({
    success: true,
    message: 'Invoice deleted successfully',
    data: invoice,
  });
});

/**
 * Get outstanding invoices
 */
export const getOutstandingInvoices = asyncHandler(async (req, res) => {
  const clientId = req.query.client_id || null;
  const invoices = await invoiceService.getOutstandingInvoices(clientId);

  res.status(200).json({
    success: true,
    data: invoices,
  });
});

/**
 * Get invoices by case
 */
export const getInvoicesByCase = asyncHandler(async (req, res) => {
  const { caseId } = req.params;
  const invoices = await invoiceService.getInvoicesByCase(caseId);

  res.status(200).json({
    success: true,
    data: invoices,
  });
});

/**
 * Get invoices by client
 */
export const getInvoicesByClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const invoices = await invoiceService.getInvoicesByClient(clientId);

  res.status(200).json({
    success: true,
    data: invoices,
  });
});

/**
 * Get invoice statistics
 */
export const getInvoiceStatistics = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const startDate = req.query.start_date ? new Date(req.query.start_date) : null;
  const endDate = req.query.end_date ? new Date(req.query.end_date) : null;

  const stats = await invoiceService.getInvoiceStatistics(firmId, startDate, endDate);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * Get revenue by month
 */
export const getRevenueByMonth = asyncHandler(async (req, res) => {
  const firmId = req.query.firm_id || null;
  const months = parseInt(req.query.months) || 12;

  const revenue = await invoiceService.getRevenueByMonth(firmId, months);

  res.status(200).json({
    success: true,
    data: revenue,
  });
});
