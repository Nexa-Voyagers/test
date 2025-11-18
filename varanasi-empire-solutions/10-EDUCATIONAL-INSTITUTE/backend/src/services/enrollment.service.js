import enrollmentRepository from '../repositories/enrollment.repository.js';
import studentRepository from '../repositories/student.repository.js';
import batchRepository from '../repositories/batch.repository.js';
import courseRepository from '../repositories/course.repository.js';
import { pool } from '../config/database.js';
import { NotFoundError, ValidationError } from '../errors.js';

/**
 * Enrollment Service
 * Contains business logic for enrollment management
 */
class EnrollmentService {
  /**
   * Create a new enrollment
   * @param {Object} enrollmentData - Enrollment details
   * @returns {Promise<Object>} Created enrollment
   */
  async createEnrollment(enrollmentData) {
    const { student_id, batch_id, discount_amount = 0 } = enrollmentData;

    // Verify student exists
    const student = await studentRepository.findById(student_id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Verify batch exists and has available seats
    const batch = await batchRepository.findById(batch_id);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }

    const availableSeats = batch.max_students - batch.enrolled_students;
    if (availableSeats <= 0) {
      throw new ValidationError('Batch is full');
    }

    // Check if student is already enrolled in this batch
    const existing = await enrollmentRepository.findByStudentAndBatch(student_id, batch_id);
    if (existing) {
      throw new ValidationError('Student is already enrolled in this batch');
    }

    // Get course fee details
    const course = await courseRepository.findById(batch.course_id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Calculate fees
    const courseFee = parseFloat(course.course_fee);
    const registrationFee = parseFloat(course.registration_fee);
    const studyMaterialFee = parseFloat(course.study_material_fee);
    const totalFeeBeforeDiscount = courseFee + registrationFee + studyMaterialFee;
    const finalFee = totalFeeBeforeDiscount - discount_amount;

    if (discount_amount < 0) {
      throw new ValidationError('Discount amount cannot be negative');
    }

    if (discount_amount > totalFeeBeforeDiscount) {
      throw new ValidationError('Discount amount cannot exceed total fee');
    }

    const feePaid = enrollmentData.fee_paid || 0;
    if (feePaid < 0) {
      throw new ValidationError('Fee paid cannot be negative');
    }

    if (feePaid > finalFee) {
      throw new ValidationError('Fee paid cannot exceed final fee');
    }

    const balanceFee = finalFee - feePaid;

    // Determine payment status
    let paymentStatus = 'PENDING';
    if (feePaid === 0) {
      paymentStatus = 'PENDING';
    } else if (balanceFee === 0) {
      paymentStatus = 'PAID';
    } else {
      paymentStatus = 'PARTIAL';
    }

    // Create enrollment in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create enrollment
      const enrollment = await enrollmentRepository.create({
        student_id,
        batch_id,
        enrollment_date: enrollmentData.enrollment_date || new Date().toISOString().split('T')[0],
        final_fee: finalFee,
        discount_amount,
        fee_paid: feePaid,
        balance_fee: balanceFee,
        payment_status: paymentStatus,
        enrollment_status: enrollmentData.enrollment_status || 'ACTIVE'
      }, client);

      // Increment enrolled students count in batch
      await batchRepository.incrementEnrolledStudents(batch_id, client);

      await client.query('COMMIT');

      // Fetch and return complete enrollment details
      return await enrollmentRepository.findById(enrollment.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get enrollment by ID
   * @param {number} id - Enrollment ID
   * @returns {Promise<Object>} Enrollment details
   */
  async getEnrollmentById(id) {
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }
    return enrollment;
  }

  /**
   * Get all enrollments
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of enrollments
   */
  async getAllEnrollments(filters = {}) {
    return await enrollmentRepository.findAll(filters);
  }

  /**
   * Update enrollment
   * @param {number} id - Enrollment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated enrollment
   */
  async updateEnrollment(id, updateData) {
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    // Validate discount if being updated
    if (updateData.discount_amount !== undefined) {
      if (updateData.discount_amount < 0) {
        throw new ValidationError('Discount amount cannot be negative');
      }

      // Recalculate fees if discount changes
      const batch = await batchRepository.findById(enrollment.batch_id);
      const course = await courseRepository.findById(batch.course_id);
      const totalFee = parseFloat(course.course_fee) +
                       parseFloat(course.registration_fee) +
                       parseFloat(course.study_material_fee);

      if (updateData.discount_amount > totalFee) {
        throw new ValidationError('Discount amount cannot exceed total fee');
      }

      updateData.final_fee = totalFee - updateData.discount_amount;
      updateData.balance_fee = updateData.final_fee - enrollment.fee_paid;

      // Update payment status
      if (updateData.balance_fee <= 0) {
        updateData.payment_status = 'PAID';
        updateData.balance_fee = 0;
      } else if (enrollment.fee_paid > 0) {
        updateData.payment_status = 'PARTIAL';
      } else {
        updateData.payment_status = 'PENDING';
      }
    }

    const updated = await enrollmentRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update enrollment');
    }

    return await enrollmentRepository.findById(id);
  }

  /**
   * Cancel enrollment
   * @param {number} id - Enrollment ID
   * @returns {Promise<Object>} Updated enrollment
   */
  async cancelEnrollment(id) {
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.enrollment_status === 'CANCELLED') {
      throw new ValidationError('Enrollment is already cancelled');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update enrollment status
      const updated = await enrollmentRepository.update(id, {
        enrollment_status: 'CANCELLED'
      }, client);

      // Decrement enrolled students count in batch
      await batchRepository.decrementEnrolledStudents(enrollment.batch_id, client);

      await client.query('COMMIT');

      return await enrollmentRepository.findById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete enrollment
   * @param {number} id - Enrollment ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteEnrollment(id) {
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.enrollment_status === 'ACTIVE') {
      throw new ValidationError('Cannot delete active enrollment. Please cancel it first.');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Delete enrollment
      await enrollmentRepository.delete(id, client);

      // Decrement enrolled students if not already cancelled
      if (enrollment.enrollment_status !== 'CANCELLED') {
        await batchRepository.decrementEnrolledStudents(enrollment.batch_id, client);
      }

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
   * Get fee defaulters
   * @param {number} instituteId - Institute ID
   * @param {number} daysOverdue - Days overdue (optional)
   * @returns {Promise<Array>} List of fee defaulters
   */
  async getFeeDefaulters(instituteId, daysOverdue = null) {
    return await enrollmentRepository.getFeeDefaulters(instituteId, daysOverdue);
  }

  /**
   * Get enrollment statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Statistics
   */
  async getEnrollmentStatistics(filters = {}) {
    return await enrollmentRepository.getStatistics(filters);
  }
}

export default new EnrollmentService();
