import courseRepository from '../repositories/course.repository.js';
import instituteRepository from '../repositories/institute.repository.js';
import { NotFoundError, ValidationError } from '../errors.js';

/**
 * Course Service
 * Contains business logic for course management
 */
class CourseService {
  /**
   * Create a new course
   * @param {Object} courseData - Course details
   * @returns {Promise<Object>} Created course
   */
  async createCourse(courseData) {
    // Verify institute exists
    const institute = await instituteRepository.findById(courseData.institute_id);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    // Check if course code already exists for this institute
    if (courseData.code) {
      const existing = await courseRepository.findByCode(
        courseData.code,
        courseData.institute_id
      );
      if (existing) {
        throw new ValidationError('Course code already exists for this institute');
      }
    }

    // Validate fee structure
    if (courseData.course_fee < 0 || courseData.registration_fee < 0 || courseData.study_material_fee < 0) {
      throw new ValidationError('Fee amounts cannot be negative');
    }

    return await courseRepository.create(courseData);
  }

  /**
   * Get course by ID
   * @param {number} id - Course ID
   * @returns {Promise<Object>} Course details
   */
  async getCourseById(id) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Calculate total fee
    const totalFee = parseFloat(course.course_fee) +
                     parseFloat(course.registration_fee) +
                     parseFloat(course.study_material_fee);

    return {
      ...course,
      total_fee: totalFee
    };
  }

  /**
   * Get all courses
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of courses
   */
  async getAllCourses(filters = {}) {
    const courses = await courseRepository.findAll(filters);

    // Add total fee to each course
    return courses.map(course => ({
      ...course,
      total_fee: parseFloat(course.course_fee) +
                 parseFloat(course.registration_fee) +
                 parseFloat(course.study_material_fee)
    }));
  }

  /**
   * Update course
   * @param {number} id - Course ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated course
   */
  async updateCourse(id, updateData) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Check if new course code conflicts
    if (updateData.code && updateData.code !== course.code) {
      const existing = await courseRepository.findByCode(
        updateData.code,
        course.institute_id
      );
      if (existing) {
        throw new ValidationError('Course code already exists for this institute');
      }
    }

    // Validate fee structure if being updated
    if (updateData.course_fee !== undefined && updateData.course_fee < 0) {
      throw new ValidationError('Course fee cannot be negative');
    }
    if (updateData.registration_fee !== undefined && updateData.registration_fee < 0) {
      throw new ValidationError('Registration fee cannot be negative');
    }
    if (updateData.study_material_fee !== undefined && updateData.study_material_fee < 0) {
      throw new ValidationError('Study material fee cannot be negative');
    }

    const updated = await courseRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update course');
    }

    return updated;
  }

  /**
   * Delete course
   * @param {number} id - Course ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCourse(id) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    return await courseRepository.delete(id);
  }

  /**
   * Get course enrollment statistics
   * @param {number} id - Course ID
   * @returns {Promise<Object>} Enrollment statistics
   */
  async getCourseEnrollmentStats(id) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const stats = await courseRepository.getEnrollmentStats(id);
    return {
      course_id: id,
      course_name: course.name,
      course_code: course.code,
      ...stats
    };
  }
}

export default new CourseService();
