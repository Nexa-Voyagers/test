import paymentRepository from '../repositories/payment.repository.js';
import enrollmentRepository from '../repositories/enrollment.repository.js';
import { pool } from '../config/database.js';
import { NotFoundError, ValidationError } from '../errors.js';

/**
 * Payment Service
 * Contains business logic for fee payment management
 */
class PaymentService {
  /**
   * Record a fee payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Created payment
   */
  async recordPayment(paymentData) {
    const { enrollment_id, amount, payment_method } = paymentData;

    // Verify enrollment exists
    const enrollment = await enrollmentRepository.findById(enrollment_id);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.enrollment_status !== 'ACTIVE') {
      throw new ValidationError('Cannot accept payment for inactive enrollment');
    }

    // Validate amount
    if (amount <= 0) {
      throw new ValidationError('Payment amount must be greater than 0');
    }

    if (amount > enrollment.balance_fee) {
      throw new ValidationError('Payment amount cannot exceed balance fee');
    }

    // Validate payment method
    const validMethods = ['CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'CHEQUE'];
    if (!validMethods.includes(payment_method)) {
      throw new ValidationError(`Invalid payment method. Must be one of: ${validMethods.join(', ')}`);
    }

    // Check for duplicate transaction ID if provided
    if (paymentData.transaction_id) {
      const existing = await paymentRepository.findByTransactionId(paymentData.transaction_id);
      if (existing) {
        throw new ValidationError('Transaction ID already exists');
      }
    }

    // Create payment and update enrollment in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create payment record
      const payment = await paymentRepository.create({
        enrollment_id,
        payment_date: paymentData.payment_date || new Date().toISOString().split('T')[0],
        amount,
        payment_method,
        transaction_id: paymentData.transaction_id || null,
        received_by: paymentData.received_by,
        remarks: paymentData.remarks || null
      }, client);

      // Update enrollment payment details
      await enrollmentRepository.updatePayment(enrollment_id, amount, client);

      await client.query('COMMIT');

      // Return complete payment details
      return await paymentRepository.findById(payment.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get payment by ID
   * @param {number} id - Payment ID
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentById(id) {
    const payment = await paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }
    return payment;
  }

  /**
   * Get all payments
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of payments
   */
  async getAllPayments(filters = {}) {
    return await paymentRepository.findAll(filters);
  }

  /**
   * Update payment
   * @param {number} id - Payment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated payment
   */
  async updatePayment(id, updateData) {
    const payment = await paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // Validate payment method if being updated
    if (updateData.payment_method) {
      const validMethods = ['CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'CHEQUE'];
      if (!validMethods.includes(updateData.payment_method)) {
        throw new ValidationError(`Invalid payment method. Must be one of: ${validMethods.join(', ')}`);
      }
    }

    // Check for duplicate transaction ID if being updated
    if (updateData.transaction_id && updateData.transaction_id !== payment.transaction_id) {
      const existing = await paymentRepository.findByTransactionId(updateData.transaction_id);
      if (existing) {
        throw new ValidationError('Transaction ID already exists');
      }
    }

    const updated = await paymentRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update payment');
    }

    return await paymentRepository.findById(id);
  }

  /**
   * Delete payment (refund scenario)
   * @param {number} id - Payment ID
   * @returns {Promise<boolean>} Success status
   */
  async deletePayment(id) {
    const payment = await paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // Delete payment and reverse enrollment payment in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Delete payment record
      const deletedPayment = await paymentRepository.delete(id, client);

      // Reverse the payment in enrollment (subtract from fee_paid, add to balance)
      await enrollmentRepository.updatePayment(payment.enrollment_id, -payment.amount, client);

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get payment history for an enrollment
   * @param {number} enrollmentId - Enrollment ID
   * @returns {Promise<Array>} Payment history
   */
  async getPaymentHistory(enrollmentId) {
    const enrollment = await enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    return await paymentRepository.getPaymentHistory(enrollmentId);
  }

  /**
   * Get pending payments
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Array>} List of enrollments with pending payments
   */
  async getPendingPayments(instituteId) {
    return await paymentRepository.getPendingPayments(instituteId);
  }

  /**
   * Get payment statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Payment statistics
   */
  async getPaymentStatistics(filters = {}) {
    return await paymentRepository.getStatistics(filters);
  }

  /**
   * Get daily collection report
   * @param {number} instituteId - Institute ID
   * @param {string} date - Date (defaults to today)
   * @returns {Promise<Object>} Daily collection report
   */
  async getDailyCollection(instituteId, date = null) {
    const reportDate = date || new Date().toISOString().split('T')[0];
    const report = await paymentRepository.getDailyCollection(instituteId, reportDate);

    if (!report) {
      return {
        collection_date: reportDate,
        total_payments: 0,
        total_amount: 0,
        unique_students: 0,
        payments: []
      };
    }

    return report;
  }

  /**
   * Generate payment receipt
   * @param {number} paymentId - Payment ID
   * @returns {Promise<Object>} Receipt details
   */
  async generateReceipt(paymentId) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // Get all payments for this enrollment
    const paymentHistory = await paymentRepository.getPaymentHistory(payment.enrollment_id);

    // Calculate cumulative amount
    const cumulativeAmount = paymentHistory
      .filter(p => new Date(p.payment_date) <= new Date(payment.payment_date))
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    return {
      receipt_number: `RCP-${payment.id.toString().padStart(6, '0')}`,
      payment_id: payment.id,
      payment_date: payment.payment_date,
      student_name: payment.student_name,
      enrollment_number: payment.enrollment_number,
      course_name: payment.course_name,
      batch_name: payment.batch_name,
      amount_paid: parseFloat(payment.amount),
      payment_method: payment.payment_method,
      transaction_id: payment.transaction_id,
      total_fee: parseFloat(payment.final_fee),
      total_paid: parseFloat(payment.fee_paid),
      balance_remaining: parseFloat(payment.balance_fee),
      cumulative_paid: cumulativeAmount,
      received_by: payment.received_by,
      remarks: payment.remarks,
      generated_at: new Date().toISOString()
    };
  }
}

export default new PaymentService();
