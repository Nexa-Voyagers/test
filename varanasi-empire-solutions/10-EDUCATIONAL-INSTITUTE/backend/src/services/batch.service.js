import batchRepository from '../repositories/batch.repository.js';
import courseRepository from '../repositories/course.repository.js';
import instituteRepository from '../repositories/institute.repository.js';
import facultyRepository from '../repositories/faculty.repository.js';
import { NotFoundError, ValidationError } from '../errors.js';

/**
 * Batch Service
 * Contains business logic for batch management
 */
class BatchService {
  /**
   * Create a new batch
   * @param {Object} batchData - Batch details
   * @returns {Promise<Object>} Created batch
   */
  async createBatch(batchData) {
    // Verify institute exists
    const institute = await instituteRepository.findById(batchData.institute_id);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    // Verify course exists
    const course = await courseRepository.findById(batchData.course_id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Verify faculty exists if provided
    if (batchData.faculty_id) {
      const faculty = await facultyRepository.findById(batchData.faculty_id);
      if (!faculty) {
        throw new NotFoundError('Faculty not found');
      }
    }

    // Check if batch code already exists for this institute
    if (batchData.batch_code) {
      const existing = await batchRepository.findByCode(
        batchData.batch_code,
        batchData.institute_id
      );
      if (existing) {
        throw new ValidationError('Batch code already exists for this institute');
      }
    }

    // Validate max students
    if (batchData.max_students <= 0) {
      throw new ValidationError('Maximum students must be greater than 0');
    }

    // Validate dates
    if (new Date(batchData.start_date) >= new Date(batchData.end_date)) {
      throw new ValidationError('End date must be after start date');
    }

    const batch = await batchRepository.create(batchData);
    return this.enrichBatchData(batch);
  }

  /**
   * Get batch by ID
   * @param {number} id - Batch ID
   * @returns {Promise<Object>} Batch details
   */
  async getBatchById(id) {
    const batch = await batchRepository.findById(id);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }
    return batch;
  }

  /**
   * Get all batches
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of batches
   */
  async getAllBatches(filters = {}) {
    return await batchRepository.findAll(filters);
  }

  /**
   * Update batch
   * @param {number} id - Batch ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated batch
   */
  async updateBatch(id, updateData) {
    const batch = await batchRepository.findById(id);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }

    // Check if new batch code conflicts
    if (updateData.batch_code && updateData.batch_code !== batch.batch_code) {
      const existing = await batchRepository.findByCode(
        updateData.batch_code,
        batch.institute_id
      );
      if (existing) {
        throw new ValidationError('Batch code already exists for this institute');
      }
    }

    // Validate max students if being updated
    if (updateData.max_students !== undefined) {
      if (updateData.max_students <= 0) {
        throw new ValidationError('Maximum students must be greater than 0');
      }
      if (updateData.max_students < batch.enrolled_students) {
        throw new ValidationError('Maximum students cannot be less than enrolled students');
      }

      // Auto-update status based on capacity
      const availableSeats = updateData.max_students - batch.enrolled_students;
      if (availableSeats === 0 && batch.status !== 'COMPLETED') {
        updateData.status = 'FULL';
      } else if (availableSeats > 0 && batch.status === 'FULL') {
        updateData.status = 'ONGOING';
      }
    }

    // Validate dates if being updated
    if (updateData.start_date || updateData.end_date) {
      const startDate = new Date(updateData.start_date || batch.start_date);
      const endDate = new Date(updateData.end_date || batch.end_date);
      if (startDate >= endDate) {
        throw new ValidationError('End date must be after start date');
      }
    }

    // Verify faculty if being updated
    if (updateData.faculty_id && updateData.faculty_id !== batch.faculty_id) {
      const faculty = await facultyRepository.findById(updateData.faculty_id);
      if (!faculty) {
        throw new NotFoundError('Faculty not found');
      }
    }

    const updated = await batchRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update batch');
    }

    return this.enrichBatchData(updated);
  }

  /**
   * Delete batch
   * @param {number} id - Batch ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteBatch(id) {
    const batch = await batchRepository.findById(id);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }

    if (batch.enrolled_students > 0) {
      throw new ValidationError('Cannot delete batch with enrolled students');
    }

    return await batchRepository.delete(id);
  }

  /**
   * Get batch statistics
   * @param {number} id - Batch ID
   * @returns {Promise<Object>} Statistics
   */
  async getBatchStatistics(id) {
    const batch = await batchRepository.findById(id);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }

    const stats = await batchRepository.getStatistics(id);
    return {
      batch_id: id,
      batch_name: batch.name,
      batch_code: batch.batch_code,
      ...stats
    };
  }

  /**
   * Get available batches for a course
   * @param {number} courseId - Course ID
   * @returns {Promise<Array>} Available batches
   */
  async getAvailableBatches(courseId) {
    const course = await courseRepository.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    return await batchRepository.getAvailableBatches(courseId);
  }

  /**
   * Enrich batch data with calculated fields
   * @param {Object} batch - Batch data
   * @returns {Object} Enriched batch data
   */
  enrichBatchData(batch) {
    const availableSeats = batch.max_students - batch.enrolled_students;
    const occupancyRate = (batch.enrolled_students / batch.max_students * 100).toFixed(2);

    return {
      ...batch,
      available_seats: availableSeats,
      occupancy_rate: parseFloat(occupancyRate),
      is_full: availableSeats === 0
    };
  }
}

export default new BatchService();
