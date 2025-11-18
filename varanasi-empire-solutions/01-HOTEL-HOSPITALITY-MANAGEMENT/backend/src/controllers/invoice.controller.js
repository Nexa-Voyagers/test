import { invoiceService } from '../services/invoice.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Create invoice
 * POST /api/v1/invoices
 */
const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body);

  res.status(201).json({
    success: true,
    message: 'Invoice created successfully',
    data: invoice,
  });
});

/**
 * Get invoice
 * GET /api/v1/invoices/:id
 */
const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getInvoice(req.params.id);

  res.json({
    success: true,
    data: invoice,
  });
});

/**
 * Get invoice by number
 * GET /api/v1/invoices/number/:invoiceNumber
 */
const getInvoiceByNumber = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getInvoiceByNumber(req.params.invoiceNumber);

  res.json({
    success: true,
    data: invoice,
  });
});

/**
 * Get invoices by reservation
 * GET /api/v1/bookings/:reservationId/invoices
 */
const getInvoicesByReservation = asyncHandler(async (req, res) => {
  const { reservationId } = req.params;

  const invoices = await invoiceService.getInvoicesByReservation(reservationId);

  res.json({
    success: true,
    data: invoices,
  });
});

/**
 * Get invoices by property
 * GET /api/v1/properties/:propertyId/invoices
 */
const getInvoicesByProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { limit = 50, offset = 0, status = null } = req.query;

  const result = await invoiceService.getInvoicesByProperty(propertyId, {
    limit: parseInt(limit),
    offset: parseInt(offset),
    status,
  });

  res.json({
    success: true,
    data: result.invoices,
    pagination: {
      total: result.totalCount,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
});

/**
 * Record payment
 * POST /api/v1/invoices/:id/payment
 */
const recordPayment = asyncHandler(async (req, res) => {
  const { amount, paymentMethod } = req.body;

  const invoice = await invoiceService.recordPayment(
    req.params.id,
    amount,
    paymentMethod
  );

  res.json({
    success: true,
    message: 'Payment recorded successfully',
    data: invoice,
  });
});

/**
 * Generate GST report
 * GET /api/v1/properties/:propertyId/invoices/gst-report
 */
const generateGSTReport = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { startDate, endDate } = req.query;

  const report = await invoiceService.generateGSTReport(propertyId, startDate, endDate);

  res.json({
    success: true,
    data: report,
  });
});

/**
 * Get unpaid invoices
 * GET /api/v1/properties/:propertyId/invoices/unpaid
 */
const getUnpaidInvoices = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const invoices = await invoiceService.getUnpaidInvoices(propertyId);

  res.json({
    success: true,
    data: invoices,
  });
});

/**
 * Get revenue statistics
 * GET /api/v1/properties/:propertyId/revenue
 */
const getRevenueStats = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { startDate, endDate } = req.query;

  const stats = await invoiceService.getRevenueStats(propertyId, startDate, endDate);

  res.json({
    success: true,
    data: stats,
  });
});

export const invoiceController = {
  createInvoice,
  getInvoice,
  getInvoiceByNumber,
  getInvoicesByReservation,
  getInvoicesByProperty,
  recordPayment,
  generateGSTReport,
  getUnpaidInvoices,
  getRevenueStats,
};
