import { invoiceRepository } from '../repositories/invoice.repository.js';
import { NotFoundError } from '../utils/errors.js';

const GST_RATE = parseFloat(process.env.GST_RATE || 18) / 100;

/**
 * Create invoice
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<Object>}
 */
const createInvoice = async (invoiceData) => {
  return await invoiceRepository.create(invoiceData);
};

/**
 * Get invoice
 * @param {string} invoiceId - Invoice ID
 * @returns {Promise<Object>}
 */
const getInvoice = async (invoiceId) => {
  const invoice = await invoiceRepository.findById(invoiceId);
  if (!invoice) {
    throw new NotFoundError('Invoice');
  }
  return invoice;
};

/**
 * Get invoice by number
 * @param {string} invoiceNumber - Invoice number
 * @returns {Promise<Object>}
 */
const getInvoiceByNumber = async (invoiceNumber) => {
  const invoice = await invoiceRepository.findByInvoiceNumber(invoiceNumber);
  if (!invoice) {
    throw new NotFoundError('Invoice');
  }
  return invoice;
};

/**
 * Get invoices by reservation
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<Array>}
 */
const getInvoicesByReservation = async (reservationId) => {
  return await invoiceRepository.findByReservation(reservationId);
};

/**
 * Get invoices by property
 * @param {string} propertyId - Property ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const getInvoicesByProperty = async (propertyId, options = {}) => {
  return await invoiceRepository.findByProperty(propertyId, options);
};

/**
 * Record payment
 * @param {string} invoiceId - Invoice ID
 * @param {number} amount - Amount paid
 * @param {string} paymentMethod - Payment method
 * @returns {Promise<Object>}
 */
const recordPayment = async (invoiceId, amount, paymentMethod = 'CASH') => {
  const invoice = await invoiceRepository.findById(invoiceId);
  if (!invoice) {
    throw new NotFoundError('Invoice');
  }

  const newPaidAmount = invoice.paid_amount + amount;
  let paymentStatus = 'PARTIAL';

  if (newPaidAmount >= invoice.total_amount) {
    paymentStatus = 'PAID';
  }

  return await invoiceRepository.updatePaymentStatus(invoiceId, paymentStatus, newPaidAmount);
};

/**
 * Generate GST report
 * @param {string} propertyId - Property ID
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Object>}
 */
const generateGSTReport = async (propertyId, startDate, endDate) => {
  const stats = await invoiceRepository.getRevenueStats(propertyId, startDate, endDate);

  return {
    period: {
      start: startDate,
      end: endDate,
    },
    summary: {
      totalInvoices: stats.total_invoices,
      totalRevenue: stats.total_revenue || 0,
      totalTax: stats.total_tax || 0,
      cgstAmount: (stats.total_tax || 0) / 2,
      sgstAmount: (stats.total_tax || 0) / 2,
      totalPaid: stats.total_paid || 0,
      totalPending: stats.total_pending || 0,
    },
  };
};

/**
 * Get unpaid invoices
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array>}
 */
const getUnpaidInvoices = async (propertyId) => {
  return await invoiceRepository.getUnpaidInvoices(propertyId);
};

/**
 * Get revenue statistics
 * @param {string} propertyId - Property ID
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Object>}
 */
const getRevenueStats = async (propertyId, startDate, endDate) => {
  return await invoiceRepository.getRevenueStats(propertyId, startDate, endDate);
};

/**
 * Calculate invoice with GST
 * @param {number} amount - Base amount
 * @returns {Object} Breakdown with taxes
 */
const calculateWithGST = (amount) => {
  const cgst = amount * (GST_RATE / 2);
  const sgst = amount * (GST_RATE / 2);
  const total = amount + cgst + sgst;

  return {
    subtotal: amount,
    cgst,
    sgst,
    totalTax: cgst + sgst,
    total,
  };
};

export const invoiceService = {
  createInvoice,
  getInvoice,
  getInvoiceByNumber,
  getInvoicesByReservation,
  getInvoicesByProperty,
  recordPayment,
  generateGSTReport,
  getUnpaidInvoices,
  getRevenueStats,
  calculateWithGST,
};
