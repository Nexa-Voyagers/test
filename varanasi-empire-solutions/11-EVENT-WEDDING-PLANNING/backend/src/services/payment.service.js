import paymentRepository from '../repositories/payment.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Service for payment business logic
 */
class PaymentService {
  /**
   * Create a new payment record
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Created payment
   */
  async createPayment(paymentData) {
    // Validate required fields
    const errors = this.validatePaymentData(paymentData);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    return await paymentRepository.create(paymentData);
  }

  /**
   * Get all payments with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of payments
   */
  async getPayments(filters = {}) {
    return await paymentRepository.findAll(filters);
  }

  /**
   * Get payment by ID
   * @param {string} id - Payment ID
   * @returns {Promise<Object>} Payment data
   */
  async getPaymentById(id) {
    return await paymentRepository.findById(id);
  }

  /**
   * Get payments for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Event payments
   */
  async getEventPayments(eventId) {
    return await paymentRepository.findByEventId(eventId);
  }

  /**
   * Get client payments for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Client payments
   */
  async getClientPayments(eventId) {
    return await paymentRepository.getClientPayments(eventId);
  }

  /**
   * Get vendor payments for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Vendor payments
   */
  async getVendorPayments(eventId) {
    return await paymentRepository.getVendorPayments(eventId);
  }

  /**
   * Get payment summary for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Payment summary
   */
  async getEventPaymentSummary(eventId) {
    const summary = await paymentRepository.getEventPaymentSummary(eventId);

    // Calculate additional metrics
    summary.net_profit = summary.total_client_payments - summary.total_vendor_payments;
    summary.client_payment_completion_percentage = summary.total_budget > 0
      ? ((summary.total_client_payments / summary.total_budget) * 100).toFixed(2)
      : 0;
    summary.cost_to_revenue_ratio = summary.total_client_payments > 0
      ? ((summary.total_vendor_payments / summary.total_client_payments) * 100).toFixed(2)
      : 0;

    return summary;
  }

  /**
   * Update payment
   * @param {string} id - Payment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated payment
   */
  async updatePayment(id, updateData) {
    // Validate amount if provided
    if (updateData.amount !== undefined) {
      if (updateData.amount <= 0) {
        throw new ValidationError([{
          field: 'amount',
          message: 'Payment amount must be greater than 0',
        }]);
      }
    }

    return await paymentRepository.update(id, updateData);
  }

  /**
   * Delete payment
   * @param {string} id - Payment ID
   * @returns {Promise<boolean>} Success status
   */
  async deletePayment(id) {
    return await paymentRepository.delete(id);
  }

  /**
   * Get payments by date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Payments in date range
   */
  async getPaymentsByDateRange(startDate, endDate, companyId = null) {
    return await paymentRepository.getPaymentsByDateRange(startDate, endDate, companyId);
  }

  /**
   * Get payment statistics by type
   * @param {string} eventId - Event ID (optional)
   * @returns {Promise<Array>} Payment statistics by type
   */
  async getPaymentStatisticsByType(eventId = null) {
    return await paymentRepository.getPaymentStatisticsByType(eventId);
  }

  /**
   * Get payment statistics by mode
   * @param {string} eventId - Event ID (optional)
   * @returns {Promise<Array>} Payment statistics by mode
   */
  async getPaymentStatisticsByMode(eventId = null) {
    return await paymentRepository.getPaymentStatisticsByMode(eventId);
  }

  /**
   * Get payment history with summary
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise<Object>} Payment history with summary
   */
  async getPaymentHistoryWithSummary(startDate, endDate) {
    return await paymentRepository.getPaymentHistoryWithSummary(startDate, endDate);
  }

  /**
   * Get recent payments
   * @param {number} limit - Number of payments
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Recent payments
   */
  async getRecentPayments(limit = 10, companyId = null) {
    return await paymentRepository.getRecentPayments(limit, companyId);
  }

  /**
   * Get monthly payment trends
   * @param {number} months - Number of months
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Monthly trends
   */
  async getMonthlyPaymentTrends(months = 12, companyId = null) {
    return await paymentRepository.getMonthlyPaymentTrends(months, companyId);
  }

  /**
   * Record client payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Created payment
   */
  async recordClientPayment(paymentData) {
    // Ensure it's a client payment type
    if (!['ADVANCE', 'INSTALLMENT', 'FINAL'].includes(paymentData.payment_type)) {
      throw new ValidationError([{
        field: 'payment_type',
        message: 'Invalid client payment type. Must be ADVANCE, INSTALLMENT, or FINAL',
      }]);
    }

    return await this.createPayment(paymentData);
  }

  /**
   * Record vendor payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Created payment
   */
  async recordVendorPayment(paymentData) {
    // Set payment type to VENDOR_PAYMENT
    paymentData.payment_type = 'VENDOR_PAYMENT';

    return await this.createPayment(paymentData);
  }

  /**
   * Calculate payment schedule
   * @param {number} totalAmount - Total amount
   * @param {number} installments - Number of installments
   * @param {string} startDate - Start date
   * @returns {Array} Payment schedule
   */
  calculatePaymentSchedule(totalAmount, installments = 3, startDate = null) {
    const schedule = [];
    const installmentAmount = totalAmount / installments;
    const start = startDate ? new Date(startDate) : new Date();

    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(start);
      dueDate.setMonth(dueDate.getMonth() + i);

      schedule.push({
        installment_number: i + 1,
        amount: installmentAmount,
        due_date: dueDate.toISOString().split('T')[0],
        payment_type: i === 0 ? 'ADVANCE' : i === installments - 1 ? 'FINAL' : 'INSTALLMENT',
      });
    }

    return schedule;
  }

  /**
   * Validate payment data
   * @param {Object} paymentData - Payment data
   * @returns {Array} Validation errors
   */
  validatePaymentData(paymentData) {
    const errors = [];

    if (!paymentData.event_id) {
      errors.push({ field: 'event_id', message: 'Event is required' });
    }

    if (!paymentData.payment_date) {
      errors.push({ field: 'payment_date', message: 'Payment date is required' });
    }

    if (!paymentData.payment_to || paymentData.payment_to.trim() === '') {
      errors.push({ field: 'payment_to', message: 'Payment recipient is required' });
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push({ field: 'amount', message: 'Payment amount must be greater than 0' });
    }

    if (!paymentData.payment_type) {
      errors.push({ field: 'payment_type', message: 'Payment type is required' });
    }

    if (!paymentData.payment_mode) {
      errors.push({ field: 'payment_mode', message: 'Payment mode is required' });
    }

    return errors;
  }
}

export default new PaymentService();
