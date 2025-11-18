import instituteRepository from '../repositories/institute.repository.js';
import { NotFoundError, ValidationError } from '../errors.js';

/**
 * Institute Service
 * Contains business logic for institute management
 */
class InstituteService {
  /**
   * Create a new institute
   * @param {Object} instituteData - Institute details
   * @returns {Promise<Object>} Created institute
   */
  async createInstitute(instituteData) {
    // Check if registration number already exists
    if (instituteData.registration_number) {
      const existing = await instituteRepository.findByRegistrationNumber(
        instituteData.registration_number
      );
      if (existing) {
        throw new ValidationError('Registration number already exists');
      }
    }

    return await instituteRepository.create(instituteData);
  }

  /**
   * Get institute by ID
   * @param {number} id - Institute ID
   * @returns {Promise<Object>} Institute details
   */
  async getInstituteById(id) {
    const institute = await instituteRepository.findById(id);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }
    return institute;
  }

  /**
   * Get all institutes
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of institutes
   */
  async getAllInstitutes(filters = {}) {
    return await instituteRepository.findAll(filters);
  }

  /**
   * Update institute
   * @param {number} id - Institute ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated institute
   */
  async updateInstitute(id, updateData) {
    // Check if institute exists
    const institute = await instituteRepository.findById(id);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    // Check if new registration number conflicts
    if (updateData.registration_number && updateData.registration_number !== institute.registration_number) {
      const existing = await instituteRepository.findByRegistrationNumber(
        updateData.registration_number
      );
      if (existing) {
        throw new ValidationError('Registration number already exists');
      }
    }

    const updated = await instituteRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update institute');
    }

    return updated;
  }

  /**
   * Delete institute
   * @param {number} id - Institute ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteInstitute(id) {
    const institute = await instituteRepository.findById(id);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    return await instituteRepository.delete(id);
  }

  /**
   * Get institute statistics
   * @param {number} id - Institute ID
   * @returns {Promise<Object>} Statistics
   */
  async getInstituteStatistics(id) {
    const institute = await instituteRepository.findById(id);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    const stats = await instituteRepository.getStatistics(id);
    return {
      ...institute,
      statistics: stats
    };
  }
}

export default new InstituteService();
