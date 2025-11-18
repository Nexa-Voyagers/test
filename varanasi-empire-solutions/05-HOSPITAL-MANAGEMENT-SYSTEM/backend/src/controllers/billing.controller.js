import { billingService } from '../services/billing.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Create bill
 * POST /api/billing
 */
export const createBill = asyncHandler(async (req, res) => {
  const { billData, billItems } = req.body;

  const bill = await billingService.createBill(
    {
      ...billData,
      hospital_id: req.user.hospital_id,
      created_by: req.user.id,
    },
    billItems
  );

  logger.info(`Bill created: ${bill.bill_number}`);

  res.status(201).json({
    success: true,
    message: 'Bill created successfully',
    data: bill,
  });
});

/**
 * Get bill by ID
 * GET /api/billing/:id
 */
export const getBill = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const bill = await billingService.getBill(id);

  res.json({
    success: true,
    data: bill,
  });
});

/**
 * Get bill by bill number
 * GET /api/billing/bill-number/:billNumber
 */
export const getBillByNumber = asyncHandler(async (req, res) => {
  const { billNumber } = req.params;
  const bill = await billingService.getBillByNumber(billNumber);

  res.json({
    success: true,
    data: bill,
  });
});

/**
 * Update payment status
 * PATCH /api/billing/:id/payment
 */
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const paymentData = req.body;

  const bill = await billingService.updatePaymentStatus(id, paymentData);

  logger.info(`Payment received for bill: ${bill.bill_number}`);

  res.json({
    success: true,
    message: 'Payment status updated successfully',
    data: bill,
  });
});

/**
 * Get revenue report
 * GET /api/billing/revenue?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export const getRevenueReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const hospitalId = req.user.hospital_id;

  const revenue = await billingService.getRevenueReport(hospitalId, startDate, endDate);

  res.json({
    success: true,
    data: revenue,
  });
});

/**
 * Generate invoice PDF
 * GET /api/billing/:id/invoice
 */
export const generateInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const invoice = await billingService.generateInvoicePDF(id);

  res.json({
    success: true,
    data: invoice,
  });
});

export default {
  createBill,
  getBill,
  getBillByNumber,
  updatePaymentStatus,
  getRevenueReport,
  generateInvoice,
};
