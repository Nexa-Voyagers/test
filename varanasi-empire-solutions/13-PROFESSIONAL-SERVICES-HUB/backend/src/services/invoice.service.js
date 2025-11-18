import invoiceRepository from '../repositories/invoice.repository.js';
import caseRepository from '../repositories/case.repository.js';
import clientRepository from '../repositories/client.repository.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Invoice Service
 * Business logic for invoice operations
 */
class InvoiceService {
  /**
   * Create a new invoice
   * @param {Object} invoiceData - Invoice data
   * @returns {Promise<Object>} Created invoice
   */
  async createInvoice(invoiceData) {
    // Check if invoice number already exists
    const existing = await invoiceRepository.findByInvoiceNumber(invoiceData.invoice_number);
    if (existing) {
      throw new ConflictError('Invoice number already exists');
    }

    // Verify case exists
    if (invoiceData.case_id) {
      const caseExists = await caseRepository.findById(invoiceData.case_id);
      if (!caseExists) {
        throw new NotFoundError('Case');
      }
    }

    // Verify client exists
    const clientExists = await clientRepository.findById(invoiceData.client_id);
    if (!clientExists) {
      throw new NotFoundError('Client');
    }

    // Validate payment status
    const validStatuses = ['PENDING', 'PARTIAL', 'PAID'];
    if (invoiceData.payment_status && !validStatuses.includes(invoiceData.payment_status)) {
      throw new Error(`Invalid payment status. Must be one of: ${validStatuses.join(', ')}`);
    }

    return await invoiceRepository.create(invoiceData);
  }

  /**
   * Get invoice by ID
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} Invoice object
   */
  async getInvoiceById(id) {
    const invoice = await invoiceRepository.findById(id);

    if (!invoice) {
      throw new NotFoundError('Invoice');
    }

    // Calculate days overdue
    const daysOverdue = this.calculateDaysOverdue(invoice.invoice_date, invoice.payment_status);

    return {
      ...invoice,
      days_overdue: daysOverdue,
      is_overdue: daysOverdue > 30 && invoice.payment_status !== 'PAID',
    };
  }

  /**
   * Get all invoices with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Invoices and pagination info
   */
  async getAllInvoices(options) {
    const result = await invoiceRepository.findAll(options);

    // Add days overdue to each invoice
    result.invoices = result.invoices.map(invoice => ({
      ...invoice,
      days_overdue: this.calculateDaysOverdue(invoice.invoice_date, invoice.payment_status),
      is_overdue: this.calculateDaysOverdue(invoice.invoice_date, invoice.payment_status) > 30 &&
                  invoice.payment_status !== 'PAID',
    }));

    return result;
  }

  /**
   * Update invoice
   * @param {string} id - Invoice ID
   * @param {Object} invoiceData - Updated invoice data
   * @returns {Promise<Object>} Updated invoice
   */
  async updateInvoice(id, invoiceData) {
    // Validate payment status if provided
    if (invoiceData.payment_status) {
      const validStatuses = ['PENDING', 'PARTIAL', 'PAID'];
      if (!validStatuses.includes(invoiceData.payment_status)) {
        throw new Error(`Invalid payment status. Must be one of: ${validStatuses.join(', ')}`);
      }
    }

    return await invoiceRepository.update(id, invoiceData);
  }

  /**
   * Update payment status
   * @param {string} id - Invoice ID
   * @param {string} status - Payment status
   * @returns {Promise<Object>} Updated invoice
   */
  async updatePaymentStatus(id, status) {
    const validStatuses = ['PENDING', 'PARTIAL', 'PAID'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid payment status. Must be one of: ${validStatuses.join(', ')}`);
    }

    return await invoiceRepository.updatePaymentStatus(id, status);
  }

  /**
   * Delete invoice
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} Deleted invoice
   */
  async deleteInvoice(id) {
    return await invoiceRepository.delete(id);
  }

  /**
   * Get outstanding invoices
   * @param {string} clientId - Client ID (optional)
   * @returns {Promise<Array>} List of outstanding invoices
   */
  async getOutstandingInvoices(clientId = null) {
    const invoices = await invoiceRepository.getOutstandingInvoices(clientId);

    return invoices.map(invoice => ({
      ...invoice,
      is_critically_overdue: parseInt(invoice.days_overdue) > 60,
    }));
  }

  /**
   * Get invoices by case
   * @param {string} caseId - Case ID
   * @returns {Promise<Array>} List of invoices
   */
  async getInvoicesByCase(caseId) {
    // Verify case exists
    const caseExists = await caseRepository.findById(caseId);
    if (!caseExists) {
      throw new NotFoundError('Case');
    }

    return await invoiceRepository.getInvoicesByCase(caseId);
  }

  /**
   * Get invoices by client
   * @param {string} clientId - Client ID
   * @returns {Promise<Array>} List of invoices
   */
  async getInvoicesByClient(clientId) {
    // Verify client exists
    const clientExists = await clientRepository.findById(clientId);
    if (!clientExists) {
      throw new NotFoundError('Client');
    }

    return await invoiceRepository.getInvoicesByClient(clientId);
  }

  /**
   * Get invoice statistics
   * @param {string} firmId - Firm ID (optional)
   * @param {Date} startDate - Start date (optional)
   * @param {Date} endDate - End date (optional)
   * @returns {Promise<Object>} Invoice statistics
   */
  async getInvoiceStatistics(firmId = null, startDate = null, endDate = null) {
    const stats = await invoiceRepository.getInvoiceStatistics(firmId, startDate, endDate);

    // Calculate collection rate
    const collectionRate = parseFloat(stats.total_amount) > 0
      ? ((parseFloat(stats.paid_amount) / parseFloat(stats.total_amount)) * 100).toFixed(2)
      : 0;

    return {
      ...stats,
      collection_rate: parseFloat(collectionRate),
    };
  }

  /**
   * Get revenue by month
   * @param {string} firmId - Firm ID (optional)
   * @param {number} months - Number of months to look back
   * @returns {Promise<Array>} Monthly revenue data
   */
  async getRevenueByMonth(firmId = null, months = 12) {
    return await invoiceRepository.getRevenueByMonth(firmId, months);
  }

  /**
   * Generate invoice number
   * @param {string} prefix - Invoice number prefix
   * @returns {string} Generated invoice number
   */
  generateInvoiceNumber(prefix = 'INV') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Calculate days overdue
   * @param {Date} invoiceDate - Invoice date
   * @param {string} paymentStatus - Payment status
   * @returns {number} Days overdue
   */
  calculateDaysOverdue(invoiceDate, paymentStatus) {
    if (paymentStatus === 'PAID') return 0;

    if (!invoiceDate) return 0;

    const today = new Date();
    const invoice = new Date(invoiceDate);
    const diffTime = Math.abs(today - invoice);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Calculate billable hours total
   * @param {number} hours - Billable hours
   * @param {number} hourlyRate - Hourly rate
   * @returns {number} Total amount
   */
  calculateBillableAmount(hours, hourlyRate) {
    return parseFloat((hours * hourlyRate).toFixed(2));
  }
}

export default new InvoiceService();
