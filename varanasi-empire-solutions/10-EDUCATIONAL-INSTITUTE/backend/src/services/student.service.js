import studentRepository from '../repositories/student.repository.js';
import instituteRepository from '../repositories/institute.repository.js';
import { NotFoundError, ValidationError } from '../errors.js';

/**
 * Student Service
 * Contains business logic for student management
 */
class StudentService {
  /**
   * Create a new student
   * @param {Object} studentData - Student details
   * @returns {Promise<Object>} Created student
   */
  async createStudent(studentData) {
    // Verify institute exists
    const institute = await instituteRepository.findById(studentData.institute_id);
    if (!institute) {
      throw new NotFoundError('Institute not found');
    }

    // Check if enrollment number already exists for this institute
    if (studentData.enrollment_number) {
      const existing = await studentRepository.findByEnrollmentNumber(
        studentData.enrollment_number,
        studentData.institute_id
      );
      if (existing) {
        throw new ValidationError('Enrollment number already exists for this institute');
      }
    }

    // Check if email already exists
    if (studentData.email) {
      const existing = await studentRepository.findByEmail(studentData.email);
      if (existing) {
        throw new ValidationError('Email already exists');
      }
    }

    // Validate previous percentage if provided
    if (studentData.previous_percentage !== undefined && studentData.previous_percentage !== null) {
      if (studentData.previous_percentage < 0 || studentData.previous_percentage > 100) {
        throw new ValidationError('Previous percentage must be between 0 and 100');
      }
    }

    return await studentRepository.create(studentData);
  }

  /**
   * Get student by ID
   * @param {number} id - Student ID
   * @returns {Promise<Object>} Student details
   */
  async getStudentById(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }
    return student;
  }

  /**
   * Get all students
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of students
   */
  async getAllStudents(filters = {}) {
    return await studentRepository.findAll(filters);
  }

  /**
   * Search students
   * @param {string} query - Search query
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Array>} Search results
   */
  async searchStudents(query, instituteId = null) {
    const filters = { search: query };
    if (instituteId) {
      filters.institute_id = instituteId;
    }
    return await studentRepository.findAll(filters);
  }

  /**
   * Update student
   * @param {number} id - Student ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated student
   */
  async updateStudent(id, updateData) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Check if new enrollment number conflicts
    if (updateData.enrollment_number && updateData.enrollment_number !== student.enrollment_number) {
      const existing = await studentRepository.findByEnrollmentNumber(
        updateData.enrollment_number,
        student.institute_id
      );
      if (existing) {
        throw new ValidationError('Enrollment number already exists for this institute');
      }
    }

    // Check if new email conflicts
    if (updateData.email && updateData.email !== student.email) {
      const existing = await studentRepository.findByEmail(updateData.email);
      if (existing) {
        throw new ValidationError('Email already exists');
      }
    }

    // Validate previous percentage if being updated
    if (updateData.previous_percentage !== undefined && updateData.previous_percentage !== null) {
      if (updateData.previous_percentage < 0 || updateData.previous_percentage > 100) {
        throw new ValidationError('Previous percentage must be between 0 and 100');
      }
    }

    const updated = await studentRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update student');
    }

    return updated;
  }

  /**
   * Delete student
   * @param {number} id - Student ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteStudent(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Check if student has active enrollments
    const enrollments = await studentRepository.getEnrollments(id);
    const activeEnrollments = enrollments.filter(e => e.enrollment_status === 'ACTIVE');

    if (activeEnrollments.length > 0) {
      throw new ValidationError('Cannot delete student with active enrollments');
    }

    return await studentRepository.delete(id);
  }

  /**
   * Get student enrollments
   * @param {number} id - Student ID
   * @returns {Promise<Array>} List of enrollments
   */
  async getStudentEnrollments(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    return await studentRepository.getEnrollments(id);
  }

  /**
   * Get student performance summary
   * @param {number} id - Student ID
   * @returns {Promise<Object>} Performance summary
   */
  async getStudentPerformance(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    const performance = await studentRepository.getPerformanceSummary(id);
    return {
      student_id: id,
      student_name: student.name,
      enrollment_number: student.enrollment_number,
      ...performance
    };
  }
}

export default new StudentService();
