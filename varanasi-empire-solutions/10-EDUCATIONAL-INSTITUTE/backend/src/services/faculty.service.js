import facultyRepository from '../repositories/faculty.repository.js';
import instituteRepository from '../repositories/institute.repository.js';
import { NotFoundError, ValidationError } from '../errors.js';

/**
 * Faculty Service
 * Contains business logic for faculty management
 */
class FacultyService {
  /**
   * Create a new faculty member
   * @param {Object} facultyData - Faculty details
   * @returns {Promise<Object>} Created faculty
   */
  async createFaculty(facultyData) {
    // Verify institute exists
    const institute = await instituteRepository.findById(facultyData.institute_id);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    // Check if employee code already exists for this institute
    if (facultyData.employee_code) {
      const existing = await facultyRepository.findByEmployeeCode(
        facultyData.employee_code,
        facultyData.institute_id
      );
      if (existing) {
        throw new ValidationError('Employee code already exists for this institute');
      }
    }

    // Check if email already exists
    if (facultyData.email) {
      const existing = await facultyRepository.findByEmail(facultyData.email);
      if (existing) {
        throw new ValidationError('Email already exists');
      }
    }

    // Validate hourly rate
    if (facultyData.hourly_rate && facultyData.hourly_rate < 0) {
      throw new ValidationError('Hourly rate cannot be negative');
    }

    // Validate experience years
    if (facultyData.experience_years && facultyData.experience_years < 0) {
      throw new ValidationError('Experience years cannot be negative');
    }

    return await facultyRepository.create(facultyData);
  }

  /**
   * Get faculty by ID
   * @param {number} id - Faculty ID
   * @returns {Promise<Object>} Faculty details
   */
  async getFacultyById(id) {
    const faculty = await facultyRepository.findById(id);
    if (!faculty) {
      throw new NotFoundError('Faculty not found');
    }
    return faculty;
  }

  /**
   * Get all faculty
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of faculty
   */
  async getAllFaculty(filters = {}) {
    return await facultyRepository.findAll(filters);
  }

  /**
   * Update faculty
   * @param {number} id - Faculty ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated faculty
   */
  async updateFaculty(id, updateData) {
    const faculty = await facultyRepository.findById(id);
    if (!faculty) {
      throw new NotFoundError('Faculty not found');
    }

    // Check if new employee code conflicts
    if (updateData.employee_code && updateData.employee_code !== faculty.employee_code) {
      const existing = await facultyRepository.findByEmployeeCode(
        updateData.employee_code,
        faculty.institute_id
      );
      if (existing) {
        throw new ValidationError('Employee code already exists for this institute');
      }
    }

    // Check if new email conflicts
    if (updateData.email && updateData.email !== faculty.email) {
      const existing = await facultyRepository.findByEmail(updateData.email);
      if (existing) {
        throw new ValidationError('Email already exists');
      }
    }

    // Validate hourly rate if being updated
    if (updateData.hourly_rate !== undefined && updateData.hourly_rate < 0) {
      throw new ValidationError('Hourly rate cannot be negative');
    }

    // Validate experience years if being updated
    if (updateData.experience_years !== undefined && updateData.experience_years < 0) {
      throw new ValidationError('Experience years cannot be negative');
    }

    const updated = await facultyRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update faculty');
    }

    return updated;
  }

  /**
   * Delete faculty
   * @param {number} id - Faculty ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteFaculty(id) {
    const faculty = await facultyRepository.findById(id);
    if (!faculty) {
      throw new NotFoundError('Faculty not found');
    }

    // Check if faculty has active batches
    const batches = await facultyRepository.getBatches(id);
    const activeBatches = batches.filter(b => b.status === 'ONGOING' || b.status === 'UPCOMING');

    if (activeBatches.length > 0) {
      throw new ValidationError('Cannot delete faculty with active batches');
    }

    return await facultyRepository.delete(id);
  }

  /**
   * Get faculty batches
   * @param {number} id - Faculty ID
   * @returns {Promise<Array>} List of batches
   */
  async getFacultyBatches(id) {
    const faculty = await facultyRepository.findById(id);
    if (!faculty) {
      throw new NotFoundError('Faculty not found');
    }

    return await facultyRepository.getBatches(id);
  }

  /**
   * Get faculty statistics
   * @param {number} id - Faculty ID
   * @returns {Promise<Object>} Statistics
   */
  async getFacultyStatistics(id) {
    const faculty = await facultyRepository.findById(id);
    if (!faculty) {
      throw new NotFoundError('Faculty not found');
    }

    const stats = await facultyRepository.getStatistics(id);
    return {
      faculty_id: id,
      faculty_name: faculty.name,
      employee_code: faculty.employee_code,
      specialization: faculty.specialization,
      ...stats
    };
  }
}

export default new FacultyService();
