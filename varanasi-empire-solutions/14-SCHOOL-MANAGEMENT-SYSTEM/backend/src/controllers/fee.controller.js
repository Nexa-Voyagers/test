import { asyncHandler } from '../utils/asyncHandler.js';
import { feeService } from '../services/fee.service.js';
import { AppError } from '../utils/errors.js';

/**
 * @desc    Create fee structure
 * @route   POST /api/v1/fees/structure
 * @access  Private (Admin only)
 */
export const createFeeStructure = asyncHandler(async (req, res) => {
  const feeStructureData = req.body;
  const schoolId = req.user.schoolId;
  const createdBy = req.user.id;

  const feeStructure = await feeService.createFeeStructure({
    ...feeStructureData,
    schoolId,
    createdBy,
  });

  res.status(201).json({
    success: true,
    message: 'Fee structure created successfully',
    data: feeStructure,
  });
});

/**
 * @desc    Get all fee structures
 * @route   GET /api/v1/fees/structure
 * @access  Private
 */
export const getAllFeeStructures = asyncHandler(async (req, res) => {
  const { academicYear, classId } = req.query;
  const schoolId = req.user.schoolId;

  const feeStructures = await feeService.getAllFeeStructures(schoolId, { academicYear, classId });

  res.json({
    success: true,
    data: feeStructures,
  });
});

/**
 * @desc    Generate fee invoices for students
 * @route   POST /api/v1/fees/generate-invoices
 * @access  Private (Admin only)
 */
export const generateFeeInvoices = asyncHandler(async (req, res) => {
  const { classId, sectionId, feeStructureId, dueDate } = req.body;
  const generatedBy = req.user.id;

  const result = await feeService.generateFeeInvoices({
    classId,
    sectionId,
    feeStructureId,
    dueDate,
    generatedBy,
  });

  res.status(201).json({
    success: true,
    message: `${result.count} invoices generated successfully`,
    data: result,
  });
});

/**
 * @desc    Get student fee invoices
 * @route   GET /api/v1/fees/student/:studentId/invoices
 * @access  Private
 */
export const getStudentInvoices = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { academicYear, status } = req.query;

  const invoices = await feeService.getStudentInvoices(studentId, { academicYear, status });

  res.json({
    success: true,
    data: invoices,
  });
});

/**
 * @desc    Record fee payment
 * @route   POST /api/v1/fees/payment
 * @access  Private (Admin/Accountant)
 */
export const recordFeePayment = asyncHandler(async (req, res) => {
  const paymentData = req.body;
  const receivedBy = req.user.id;

  const payment = await feeService.recordFeePayment({ ...paymentData, receivedBy });

  res.status(201).json({
    success: true,
    message: 'Payment recorded successfully',
    data: payment,
  });
});

/**
 * @desc    Get fee payment history
 * @route   GET /api/v1/fees/student/:studentId/payments
 * @access  Private
 */
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { academicYear } = req.query;

  const payments = await feeService.getPaymentHistory(studentId, academicYear);

  res.json({
    success: true,
    data: payments,
  });
});

/**
 * @desc    Get fee defaulters
 * @route   GET /api/v1/fees/defaulters
 * @access  Private (Admin/Accountant)
 */
export const getFeeDefaulters = asyncHandler(async (req, res) => {
  const { classId, sectionId, academicYear } = req.query;
  const schoolId = req.user.schoolId;

  const defaulters = await feeService.getFeeDefaulters(schoolId, { classId, sectionId, academicYear });

  res.json({
    success: true,
    data: defaulters,
  });
});

/**
 * @desc    Apply fee discount/scholarship
 * @route   POST /api/v1/fees/discount
 * @access  Private (Admin only)
 */
export const applyDiscount = asyncHandler(async (req, res) => {
  const { studentId, invoiceId, discountType, discountAmount, reason } = req.body;
  const appliedBy = req.user.id;

  const result = await feeService.applyDiscount({
    studentId,
    invoiceId,
    discountType,
    discountAmount,
    reason,
    appliedBy,
  });

  res.json({
    success: true,
    message: 'Discount applied successfully',
    data: result,
  });
});

/**
 * @desc    Generate fee receipt
 * @route   GET /api/v1/fees/payment/:paymentId/receipt
 * @access  Private
 */
export const generateReceipt = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const receipt = await feeService.generateReceipt(paymentId);

  res.json({
    success: true,
    data: receipt,
  });
});

/**
 * @desc    Get fee collection report
 * @route   GET /api/v1/fees/reports/collection
 * @access  Private (Admin/Accountant)
 */
export const getFeeCollectionReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, classId, paymentMode } = req.query;
  const schoolId = req.user.schoolId;

  const report = await feeService.getFeeCollectionReport(schoolId, {
    startDate,
    endDate,
    classId,
    paymentMode,
  });

  res.json({
    success: true,
    data: report,
  });
});

/**
 * @desc    Send fee reminder notifications
 * @route   POST /api/v1/fees/send-reminders
 * @access  Private (Admin)
 */
export const sendFeeReminders = asyncHandler(async (req, res) => {
  const { classId, sectionId, dueDate } = req.body;
  const schoolId = req.user.schoolId;

  const result = await feeService.sendFeeReminders(schoolId, { classId, sectionId, dueDate });

  res.json({
    success: true,
    message: `Reminders sent to ${result.count} parents`,
    data: result,
  });
});
